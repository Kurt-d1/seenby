import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  var { id: placeId } = await params

  var apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    // Fetch detailed place information from Google
    var url = "https://maps.googleapis.com/maps/api/place/details/json" +
      "?place_id=" + placeId +
      "&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry,opening_hours,price_level,business_status" +
      "&key=" + apiKey

    var response = await fetch(url)
    var data = await response.json()

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status)
      return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 })
    }

    var place = data.result

    var business = {
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number || null,
      website: place.website || null,
      rating: place.rating || null,
      review_count: place.user_ratings_total || 0,
      category: place.types?.[0]?.replace(/_/g, " ") || "Business",
      types: place.types || [],
      latitude: place.geometry?.location?.lat || null,
      longitude: place.geometry?.location?.lng || null,
      opening_hours: place.opening_hours?.weekday_text || null,
      price_level: place.price_level || null,
      business_status: place.business_status || null
    }

    return NextResponse.json({ business })

  } catch (error) {
    console.error("Business fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 })
  }
}