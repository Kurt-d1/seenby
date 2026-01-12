import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  var searchParams = request.nextUrl.searchParams
  var query = searchParams.get("query") || ""
  var location = searchParams.get("location") || ""

  console.log("Search request:", { query, location })

  var apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    console.error("No Google API key found")
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    var searchQuery = query
    if (location) {
      searchQuery = query + " " + location
    }

    var url = "https://maps.googleapis.com/maps/api/place/textsearch/json" +
      "?query=" + encodeURIComponent(searchQuery) +
      "&key=" + apiKey

    console.log("Calling Google Places API...")

    var response = await fetch(url)
    var data = await response.json()

    console.log("Google API response status:", data.status)
    console.log("Results count:", data.results?.length || 0)

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google API error:", data.status, data.error_message)
      return NextResponse.json({ error: "Search failed: " + data.status }, { status: 500 })
    }

    var results = (data.results || []).slice(0, 5).map(function(place: any) {
      return {
        place_id: place.place_id,
        name: place.name,
        address: place.formatted_address || "",
        rating: place.rating || null,
        review_count: place.user_ratings_total || 0,
        category: place.types?.[0]?.replace(/_/g, " ") || ""
      }
    })

    console.log("Returning results:", results.length)

    return NextResponse.json({ results })

  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}