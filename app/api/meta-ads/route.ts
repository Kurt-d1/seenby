import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    var body = await request.json()
    var { businessName, country } = body

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 })
    }

    var countryCode = country || "MT"

    console.log("Checking Meta Ad Library for:", businessName)

    // The Ad Library API requires special access, but we can provide the search URL
    // and check if there are any results via the public API endpoint
    var adLibraryUrl = "https://www.facebook.com/ads/library/" +
      "?active_status=active" +
      "&ad_type=all" +
      "&country=" + countryCode +
      "&q=" + encodeURIComponent(businessName) +
      "&search_type=keyword_unordered"

    // Try to use the Ad Library API (requires approved access)
    var accessToken = process.env.FACEBOOK_ACCESS_TOKEN || ""
    
    if (accessToken) {
      try {
        var apiUrl = "https://graph.facebook.com/v18.0/ads_archive" +
          "?search_terms=" + encodeURIComponent(businessName) +
          "&ad_reached_countries=['" + countryCode + "']" +
          "&ad_active_status=ACTIVE" +
          "&fields=id,ad_creative_link_titles,page_name" +
          "&limit=10" +
          "&access_token=" + accessToken

        var apiResponse = await fetch(apiUrl)
        var apiData = await apiResponse.json()

        if (!apiData.error && apiData.data) {
          var hasAds = apiData.data.length > 0
          var adCount = apiData.data.length

          console.log("Ad Library result:", hasAds ? adCount + " ads found" : "No ads")

          return NextResponse.json({
            has_ads: hasAds,
            ad_count: adCount,
            ads: apiData.data.slice(0, 5),
            ad_library_url: adLibraryUrl
          })
        }
      } catch (apiError) {
        console.log("Ad Library API not available, using fallback")
      }
    }

    // Fallback - return the URL for manual checking
    return NextResponse.json({
      has_ads: null,
      ad_count: null,
      ad_library_url: adLibraryUrl,
      note: "Manual verification required - click the link to check"
    })

  } catch (error) {
    console.error("Meta ads check error:", error)
    return NextResponse.json({ error: "Check failed" }, { status: 500 })
  }
}