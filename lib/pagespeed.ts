export interface PageSpeedResult {
  performance_score: number
  seo_score: number
  accessibility_score: number
  best_practices_score: number
  first_contentful_paint: number
  speed_index: number
  largest_contentful_paint: number
  time_to_interactive: number
  total_blocking_time: number
  cumulative_layout_shift: number
}

export async function analyzeWebsite(url: string): Promise<PageSpeedResult | null> {
  var apiKey = process.env.GOOGLE_PAGESPEED_API_KEY

  // Clean up URL
  if (!url.startsWith("http")) {
    url = "https://" + url
  }

  try {
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

    console.log("Analyzing website:", url)

    var response = await fetch(apiUrl)
    var data = await response.json()

    if (data.error) {
      console.error("PageSpeed API error:", data.error.message)
      return null
    }

    var lighthouse = data.lighthouseResult
    if (!lighthouse) {
      console.error("No lighthouse result")
      return null
    }

    var categories = lighthouse.categories || {}
    var audits = lighthouse.audits || {}

    var result: PageSpeedResult = {
      performance_score: Math.round((categories.performance?.score || 0) * 100),
      seo_score: Math.round((categories.seo?.score || 0) * 100),
      accessibility_score: Math.round((categories.accessibility?.score || 0) * 100),
      best_practices_score: Math.round((categories["best-practices"]?.score || 0) * 100),
      first_contentful_paint: audits["first-contentful-paint"]?.numericValue || 0,
      speed_index: audits["speed-index"]?.numericValue || 0,
      largest_contentful_paint: audits["largest-contentful-paint"]?.numericValue || 0,
      time_to_interactive: audits["interactive"]?.numericValue || 0,
      total_blocking_time: audits["total-blocking-time"]?.numericValue || 0,
      cumulative_layout_shift: audits["cumulative-layout-shift"]?.numericValue || 0
    }

    console.log("PageSpeed result:", result.performance_score, "perf,", result.seo_score, "seo")

    return result
  } catch (error) {
    console.error("PageSpeed analysis failed:", error)
    return null
  }
}

export async function quickWebsiteCheck(url: string): Promise<{
  accessible: boolean
  has_ssl: boolean
  redirect_url?: string
}> {
  if (!url) {
    return { accessible: false, has_ssl: false }
  }

  if (!url.startsWith("http")) {
    url = "https://" + url
  }

  try {
    var controller = new AbortController()
    var timeout = setTimeout(function() { controller.abort() }, 10000)

    var response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow"
    })

    clearTimeout(timeout)

    return {
      accessible: response.ok,
      has_ssl: response.url.startsWith("https"),
      redirect_url: response.url !== url ? response.url : undefined
    }
  } catch (error) {
    return { accessible: false, has_ssl: false }
  }
}