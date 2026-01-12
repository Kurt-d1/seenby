import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    var body = await request.json()
    var { keywords, location, latitude, longitude, exclude_place_id } = body

    if (!keywords || !location) {
      return NextResponse.json(
        { error: "Keywords and location are required" },
        { status: 400 }
      )
    }

    // Build search query
    var searchQuery = keywords + " in " + location

    // Call Google Places API to search for competitors
    var apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Places API key not configured" },
        { status: 500 }
      )
    }

    // Use Text Search API to find competitors
    var searchUrl = "https://places.googleapis.com/v1/places:searchText"
    var searchResponse = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.primaryType,places.location"
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 20,
        locationBias: latitude && longitude ? {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude
            },
            radius: 5000.0
          }
        } : undefined
      })
    })

    if (!searchResponse.ok) {
      var errorText = await searchResponse.text()
      console.error("Google Places API error:", errorText)
      return NextResponse.json(
        { error: "Failed to search for competitors" },
        { status: 500 }
      )
    }

    var searchData = await searchResponse.json()
    var places = searchData.places || []

    // Filter out the business itself
    var competitors = places
      .filter(function(place: any) {
        return place.id !== exclude_place_id
      })
      .map(function(place: any) {
        return {
          place_id: place.id,
          name: place.displayName?.text || "Unknown",
          address: place.formattedAddress || "",
          rating: place.rating || null,
          review_count: place.userRatingCount || 0,
          category: place.primaryType || "business"
        }
      })

    // Calculate stats
    var totalFound = competitors.length
    var ratingsSum = 0
    var ratingsCount = 0
    var reviewsSum = 0
    var highestRated = null
    var mostReviews = null

    for (var i = 0; i < competitors.length; i++) {
      var comp = competitors[i]

      if (comp.rating !== null) {
        ratingsSum += comp.rating
        ratingsCount++

        if (!highestRated || comp.rating > highestRated.rating) {
          highestRated = { name: comp.name, rating: comp.rating }
        }
      }

      reviewsSum += comp.review_count

      if (!mostReviews || comp.review_count > mostReviews.review_count) {
        mostReviews = { name: comp.name, review_count: comp.review_count }
      }
    }

    var averageRating = ratingsCount > 0 ? (ratingsSum / ratingsCount).toFixed(1) : null
    var averageReviews = totalFound > 0 ? Math.round(reviewsSum / totalFound) : 0

    var stats = {
      total_found: totalFound,
      average_rating: averageRating,
      average_reviews: averageReviews,
      highest_rated: highestRated,
      most_reviews: mostReviews
    }

    return NextResponse.json({
      competitors: competitors,
      stats: stats,
      search_query: searchQuery
    })

  } catch (error) {
    console.error("Competitor search error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
