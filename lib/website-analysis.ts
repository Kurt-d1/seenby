export interface WebsiteAnalysis {
  url: string
  accessible: boolean
  load_time_ms: number | null
  has_ssl: boolean
  mobile_friendly: boolean | null
  speed_score: number | null
  seo_score: number | null
  has_meta_title: boolean
  has_meta_description: boolean
  has_og_tags: boolean
  has_schema_markup: boolean
  error?: string
}

export async function quickWebsiteCheck(websiteUrl: string): Promise<WebsiteAnalysis> {
  var result: WebsiteAnalysis = {
    url: websiteUrl,
    accessible: false,
    load_time_ms: null,
    has_ssl: false,
    mobile_friendly: null,
    speed_score: null,
    seo_score: null,
    has_meta_title: false,
    has_meta_description: false,
    has_og_tags: false,
    has_schema_markup: false
  }

  try {
    if (!websiteUrl.startsWith("http")) {
      websiteUrl = "https://" + websiteUrl
    }
    result.url = websiteUrl
    result.has_ssl = websiteUrl.startsWith("https")

    var startTime = Date.now()
    var response = await fetch(websiteUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SeenByBot/1.0)"
      }
    })

    result.load_time_ms = Date.now() - startTime
    result.accessible = response.ok

    if (!result.accessible) {
      return result
    }

    var html = await response.text()
    
    result.has_meta_title = /<title[^>]*>.*?<\/title>/i.test(html)
    result.has_meta_description = /<meta[^>]*name=["']description["'][^>]*>/i.test(html)
    result.has_og_tags = /<meta[^>]*property=["']og:/i.test(html)
    result.has_schema_markup = /application\/ld\+json/i.test(html) || /itemtype=["']http:\/\/schema\.org/i.test(html)

    var seoPoints = 0
    if (result.has_ssl) seoPoints += 20
    if (result.has_meta_title) seoPoints += 25
    if (result.has_meta_description) seoPoints += 25
    if (result.has_og_tags) seoPoints += 15
    if (result.has_schema_markup) seoPoints += 15
    result.seo_score = seoPoints

    if (result.load_time_ms) {
      if (result.load_time_ms < 1000) result.speed_score = 90
      else if (result.load_time_ms < 2000) result.speed_score = 75
      else if (result.load_time_ms < 3000) result.speed_score = 60
      else if (result.load_time_ms < 5000) result.speed_score = 40
      else result.speed_score = 20
    }

    return result

  } catch (error) {
    console.error("Quick website check error:", error)
    result.error = "Check failed"
    return result
  }
}

export async function analyzeWebsite(websiteUrl: string, apiKey: string): Promise<WebsiteAnalysis> {
  return quickWebsiteCheck(websiteUrl)
}