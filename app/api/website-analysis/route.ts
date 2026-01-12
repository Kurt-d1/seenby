import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
var supabase = createClient(supabaseUrl, supabaseKey)

var CACHE_DAYS = 7

export async function POST(request: NextRequest) {
  try {
    var body = await request.json()
    var url = body.url
    var skipCache = body.skipCache || false

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Normalize URL
    if (!url.startsWith("http")) {
      url = "https://" + url
    }
    
    // Remove trailing slash for consistency
    url = url.replace(/\/$/, "")

    console.log("Website analysis request:", url)

    // Check cache first (unless skipCache is true)
    if (!skipCache) {
      var cacheDate = new Date()
      cacheDate.setDate(cacheDate.getDate() - CACHE_DAYS)

      var { data: cached } = await supabase
        .from("website_cache")
        .select("*")
        .eq("url", url)
        .gte("updated_at", cacheDate.toISOString())
        .single()

      if (cached) {
        console.log("Returning cached result for:", url)
        return NextResponse.json({
          accessible: cached.accessible,
          has_ssl: cached.has_ssl,
          speed_score: cached.speed_score,
          seo_score: cached.seo_score,
          accessibility_score: cached.accessibility_score,
          best_practices_score: cached.best_practices_score,
          cached: true
        })
      }
    }

    // Quick accessibility check
    var accessible = false
    var has_ssl = url.startsWith("https")

    try {
      var checkResponse = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(10000)
      })
      accessible = checkResponse.ok
      has_ssl = checkResponse.url.startsWith("https")
    } catch (e) {
      console.log("Site not accessible:", url)
    }

    // Call Google PageSpeed API
    var apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || ""
    var apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed" +
      "?url=" + encodeURIComponent(url) +
      "&category=performance" +
      "&category=seo" +
      "&category=accessibility" +
      "&category=best-practices" +
      "&strategy=mobile"

    if (apiKey) {
      apiUrl += "&key=" + apiKey
    }

    console.log("Calling PageSpeed API for:", url)

    var response = await fetch(apiUrl)
    var data = await response.json()

    if (data.error) {
      console.error("PageSpeed API error:", data.error.message)
      return NextResponse.json({
        accessible: accessible,
        has_ssl: has_ssl,
        speed_score: null,
        seo_score: null,
        error: data.error.message
      })
    }

    var lighthouse = data.lighthouseResult
    if (!lighthouse) {
      return NextResponse.json({
        accessible: accessible,
        has_ssl: has_ssl,
        speed_score: null,
        seo_score: null,
        error: "No lighthouse result"
      })
    }

    var categories = lighthouse.categories || {}

    var result = {
      accessible: accessible,
      has_ssl: has_ssl,
      speed_score: Math.round((categories.performance?.score || 0) * 100),
      seo_score: Math.round((categories.seo?.score || 0) * 100),
      accessibility_score: Math.round((categories.accessibility?.score || 0) * 100),
      best_practices_score: Math.round((categories["best-practices"]?.score || 0) * 100)
    }

    console.log("PageSpeed result:", result.speed_score, "perf,", result.seo_score, "seo")

    // Save to cache
    await supabase
      .from("website_cache")
      .upsert({
        url: url,
        speed_score: result.speed_score,
        seo_score: result.seo_score,
        accessibility_score: result.accessibility_score,
        best_practices_score: result.best_practices_score,
        accessible: result.accessible,
        has_ssl: result.has_ssl,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "url"
      })

    console.log("Cached result for:", url)

    return NextResponse.json(result)

  } catch (error) {
    console.error("Website analysis error:", error)
    return NextResponse.json({ 
      error: "Analysis failed",
      accessible: false,
      has_ssl: false,
      speed_score: null,
      seo_score: null
    }, { status: 500 })
  }
}