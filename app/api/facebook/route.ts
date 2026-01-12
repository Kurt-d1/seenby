import { NextRequest, NextResponse } from "next/server"

var accessToken = process.env.FACEBOOK_ACCESS_TOKEN || ""

export async function POST(request: NextRequest) {
  try {
    var body = await request.json()
    var { businessName } = body

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Facebook access token not configured" }, { status: 500 })
    }

    console.log("Searching Facebook for:", businessName)

    var searchUrl = "https://graph.facebook.com/v18.0/pages/search" +
      "?q=" + encodeURIComponent(businessName) +
      "&fields=id,name,location,fan_count,followers_count,link,category,about,website" +
      "&access_token=" + accessToken

    var searchResponse = await fetch(searchUrl)
    var searchData = await searchResponse.json()

    if (searchData.error) {
      console.error("Facebook API error:", searchData.error)
      return NextResponse.json({
        pages: [],
        error: searchData.error.message,
        ad_library_url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=MT&q=" + encodeURIComponent(businessName)
      })
    }

    var pages = searchData.data || []
    console.log("Found", pages.length, "Facebook pages")

    var formattedPages = pages.map(function(page: any) {
      return {
        id: page.id,
        name: page.name,
        followers: page.followers_count || page.fan_count || 0,
        category: page.category || null,
        link: page.link || "https://facebook.com/" + page.id,
        website: page.website || null,
        location: page.location || null
      }
    })

    return NextResponse.json({
      pages: formattedPages,
      query: businessName
    })

  } catch (error) {
    console.error("Facebook search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
