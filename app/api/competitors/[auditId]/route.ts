import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { scanGoogleEnhanced, scanAllDirectories, calculateHealthScore } from "@/lib/directories"
import { analyzeSocialPresence } from "@/lib/social-analysis"
import { quickWebsiteCheck } from "@/lib/website-analysis"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  try {
    var resolvedParams = await params
    var auditId = resolvedParams.auditId

    var body = await request.json()
    var { place_id, name, website, types, latitude, longitude, keywords, location, category } = body

    console.log("Comprehensive competition analysis:", { name, keywords, location })

    var apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Step 1: Create competitor analysis record
    var { data: analysis, error: analysisError } = await supabase
      .from("competitor_analyses")
      .insert({
        audit_id: auditId,
        status: "processing"
      })
      .select("id")
      .single()

    if (analysisError || !analysis) {
      console.error("Error creating analysis:", analysisError)
      return NextResponse.json({ error: "Failed to create analysis" }, { status: 500 })
    }

    // Step 2: Run comprehensive analysis on YOUR business first
    console.log("Analyzing your business...")
    var yourGoogleData = await scanGoogleEnhanced(place_id, apiKey)
    var yourSocialData = await analyzeSocialPresence(name, website || yourGoogleData?.website, "MT")
    var yourWebsiteData = null
    if (website || yourGoogleData?.website) {
      yourWebsiteData = await quickWebsiteCheck(website || yourGoogleData?.website || "")
    }

    var yourAnalysis = {
      business_name: name,
      google: {
        rating: yourGoogleData?.rating || null,
        review_count: yourGoogleData?.review_count || 0,
        photos_count: yourGoogleData?.photos_count || 0,
        has_website: !!(yourGoogleData?.website),
        google_maps_url: yourGoogleData?.google_maps_url || null
      },
      social: {
        facebook_followers: yourSocialData.facebook.followers,
        facebook_posts_monthly: yourSocialData.facebook.posts_last_30_days,
        facebook_engagement: yourSocialData.facebook.engagement_rate,
        facebook_has_ads: yourSocialData.facebook.has_active_ads,
        instagram_followers: yourSocialData.instagram.followers,
        instagram_posts_monthly: yourSocialData.instagram.posts_last_30_days,
        instagram_engagement: yourSocialData.instagram.engagement_rate,
        instagram_has_ads: yourSocialData.instagram.has_active_ads,
        social_score: yourSocialData.social_score,
        ad_library_url: yourSocialData.facebook.ad_library_url
      },
      website: {
        accessible: yourWebsiteData?.accessible || false,
        speed_score: yourWebsiteData?.speed_score || null,
        seo_score: yourWebsiteData?.seo_score || null,
        has_ssl: yourWebsiteData?.has_ssl || false,
        mobile_friendly: yourWebsiteData?.mobile_friendly || null
      },
      overall_score: calculateComprehensiveScore(yourGoogleData, yourSocialData, yourWebsiteData)
    }

    // Step 3: Build search query and find competitors
    var searchQuery = ""
    if (keywords && keywords.trim()) {
      searchQuery = keywords.trim()
    } else if (category && category.trim()) {
      searchQuery = category.trim()
    } else if (types && types.length > 0) {
      var genericTypes = ["point_of_interest", "establishment", "food", "store"]
      for (var i = 0; i < types.length; i++) {
        if (genericTypes.indexOf(types[i]) === -1) {
          searchQuery = types[i].replace(/_/g, " ")
          break
        }
      }
    }
    
    if (!searchQuery) searchQuery = "business"
    if (location && location.trim()) {
      searchQuery = searchQuery + " in " + location.trim()
    }

    console.log("Searching for competitors:", searchQuery)

    var searchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json" +
      "?query=" + encodeURIComponent(searchQuery) +
      "&location=" + latitude + "," + longitude +
      "&radius=30000" +
      "&key=" + apiKey

    var searchResponse = await fetch(searchUrl)
    var searchData = await searchResponse.json()

    if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
      console.error("Google Places error:", searchData.status)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    var competitors = (searchData.results || [])
      .filter(function(p: any) {
        return p.place_id !== place_id && p.name.toLowerCase() !== name.toLowerCase()
      })
      .slice(0, 5)

    console.log("Found", competitors.length, "competitors")

    // Step 4: Run comprehensive analysis on each competitor
    var competitorAnalyses = []

    for (var j = 0; j < competitors.length; j++) {
      var comp = competitors[j]
      console.log("Analyzing competitor:", comp.name)

      var compGoogleData = await scanGoogleEnhanced(comp.place_id, apiKey)
var compSocialData = await analyzeSocialPresence(comp.name, compGoogleData?.website || null, "MT")
      var compWebsiteData = null
      if (compGoogleData?.website) {
        compWebsiteData = await quickWebsiteCheck(compGoogleData.website)
      }

      var compAnalysis = {
        business_name: comp.name,
        google: {
          rating: compGoogleData?.rating || null,
          review_count: compGoogleData?.review_count || 0,
          photos_count: compGoogleData?.photos_count || 0,
          has_website: !!(compGoogleData?.website),
          google_maps_url: compGoogleData?.google_maps_url || null
        },
        social: {
          facebook_followers: compSocialData.facebook.followers,
          facebook_posts_monthly: compSocialData.facebook.posts_last_30_days,
          facebook_engagement: compSocialData.facebook.engagement_rate,
          facebook_has_ads: compSocialData.facebook.has_active_ads,
          instagram_followers: compSocialData.instagram.followers,
          instagram_posts_monthly: compSocialData.instagram.posts_last_30_days,
          instagram_engagement: compSocialData.instagram.engagement_rate,
          instagram_has_ads: compSocialData.instagram.has_active_ads,
          social_score: compSocialData.social_score,
          ad_library_url: compSocialData.facebook.ad_library_url
        },
        website: {
          accessible: compWebsiteData?.accessible || false,
          speed_score: compWebsiteData?.speed_score || null,
          seo_score: compWebsiteData?.seo_score || null,
          has_ssl: compWebsiteData?.has_ssl || false,
          mobile_friendly: compWebsiteData?.mobile_friendly || null
        },
        overall_score: calculateComprehensiveScore(compGoogleData, compSocialData, compWebsiteData)
      }

      competitorAnalyses.push(compAnalysis)

      // Save to database
      await supabase
        .from("competitor_results")
        .insert({
          competitor_analysis_id: analysis.id,
          google_place_id: comp.place_id,
          name: comp.name,
          address: comp.formatted_address || "",
          rating: compGoogleData?.rating || null,
          review_count: compGoogleData?.review_count || 0,
          health_score: compAnalysis.overall_score,
          directories_found: 0,
          directories_checked: 0
        })
    }

    // Step 5: Calculate averages
    var avgScore = competitorAnalyses.length > 0 
      ? Math.round(competitorAnalyses.reduce(function(sum, c) { return sum + c.overall_score }, 0) / competitorAnalyses.length)
      : 0

    // Step 6: Update analysis record
    await supabase
      .from("competitor_analyses")
      .update({
        status: "completed",
        competitor_count: competitorAnalyses.length,
        average_competitor_score: avgScore,
        completed_at: new Date().toISOString()
      })
      .eq("id", analysis.id)

    console.log("Competition analysis complete")

    return NextResponse.json({
      analysis_id: analysis.id,
      search_query: searchQuery,
      your_analysis: yourAnalysis,
      competitor_analyses: competitorAnalyses,
      average_score: avgScore,
      competitor_count: competitorAnalyses.length
    })

  } catch (error) {
    console.error("Competitor analysis error:", error)
    return NextResponse.json({ error: "Analysis failed: " + String(error) }, { status: 500 })
  }
}

function calculateComprehensiveScore(google: any, social: any, website: any): number {
  var score = 0

  // Google (35 points)
  if (google) {
    if (google.rating) score += Math.min(15, (google.rating / 5) * 15)
    if (google.review_count > 100) score += 10
    else if (google.review_count > 50) score += 8
    else if (google.review_count > 20) score += 6
    else if (google.review_count > 5) score += 4
    else if (google.review_count > 0) score += 2
    if (google.photos_count > 10) score += 5
    else if (google.photos_count > 5) score += 3
    else if (google.photos_count > 0) score += 1
    if (google.website) score += 5
  }

  // Social (40 points)
  if (social) {
    score += Math.round(social.social_score * 0.4)
  }

  // Website (25 points)
  if (website && website.accessible) {
    score += 10
    if (website.has_ssl) score += 5
    if (website.speed_score) score += Math.round((website.speed_score / 100) * 5)
    if (website.seo_score) score += Math.round((website.seo_score / 100) * 5)
  }

  return Math.min(100, Math.round(score))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  try {
    var resolvedParams = await params
    var auditId = resolvedParams.auditId

    var { data: analysis } = await supabase
      .from("competitor_analyses")
      .select("*")
      .eq("audit_id", auditId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    var { data: competitors } = await supabase
      .from("competitor_results")
      .select("*")
      .eq("competitor_analysis_id", analysis.id)

    return NextResponse.json({ analysis, competitors })

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}