// Directory scanning functions

export interface DirectoryScanResult {
  directory: string
  status: "found" | "not_found" | "error"
  icon: string
  external_url?: string
  found_name?: string
  found_address?: string
  found_phone?: string
  found_rating?: number
  found_review_count?: number
}

export interface GoogleBusinessData {
  name: string
  address: string
  phone: string | null
  website: string | null
  rating: number | null
  review_count: number
  photos_count: number
  price_level: number | null
  business_status: string | null
  types: string[]
  opening_hours: string[] | null
  google_maps_url: string | null
}

// Enhanced Google Business scan
export async function scanGoogleEnhanced(placeId: string, apiKey: string): Promise<GoogleBusinessData | null> {
  try {
    var url = "https://maps.googleapis.com/maps/api/place/details/json" +
      "?place_id=" + placeId +
      "&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,photos,price_level,business_status,types,opening_hours,url" +
      "&key=" + apiKey

    var response = await fetch(url)
    var data = await response.json()

    if (data.status === "OK" && data.result) {
      var place = data.result
      return {
        name: place.name || "",
        address: place.formatted_address || "",
        phone: place.formatted_phone_number || null,
        website: place.website || null,
        rating: place.rating || null,
        review_count: place.user_ratings_total || 0,
        photos_count: place.photos ? place.photos.length : 0,
        price_level: place.price_level || null,
        business_status: place.business_status || null,
        types: place.types || [],
        opening_hours: place.opening_hours?.weekday_text || null,
        google_maps_url: place.url || null
      }
    }

    return null
  } catch (error) {
    console.error("Google enhanced scan error:", error)
    return null
  }
}

// Scan Google Business using Places API
export async function scanGoogle(placeId: string, apiKey: string): Promise<DirectoryScanResult> {
  try {
    var url = "https://maps.googleapis.com/maps/api/place/details/json" +
      "?place_id=" + placeId +
      "&fields=name,formatted_address,formatted_phone_number,rating,user_ratings_total,url" +
      "&key=" + apiKey

    var response = await fetch(url)
    var data = await response.json()

    if (data.status === "OK" && data.result) {
      return {
        directory: "Google Business",
        status: "found",
        icon: "🔍",
        external_url: data.result.url || undefined,
        found_name: data.result.name,
        found_address: data.result.formatted_address,
        found_phone: data.result.formatted_phone_number || undefined,
        found_rating: data.result.rating || undefined,
        found_review_count: data.result.user_ratings_total || undefined
      }
    }

    return {
      directory: "Google Business",
      status: "not_found",
      icon: "🔍"
    }
  } catch (error) {
    console.error("Google scan error:", error)
    return {
      directory: "Google Business",
      status: "error",
      icon: "🔍"
    }
  }
}

// Scan Facebook (simulated for now - requires Facebook Graph API setup)
export async function scanFacebook(businessName: string, location: string): Promise<DirectoryScanResult> {
  await new Promise(function(resolve) { setTimeout(resolve, 300) })
  
  var hash = 0
  for (var i = 0; i < businessName.length; i++) {
    hash = ((hash << 5) - hash) + businessName.charCodeAt(i)
    hash = hash & hash
  }
  var isFound = Math.abs(hash % 10) > 3

  return {
    directory: "Facebook",
    status: isFound ? "found" : "not_found",
    icon: "📘",
    found_name: isFound ? businessName : undefined
  }
}

// Scan Instagram (simulated for now)
export async function scanInstagram(businessName: string, location: string): Promise<DirectoryScanResult> {
  await new Promise(function(resolve) { setTimeout(resolve, 300) })
  
  var hash = 0
  for (var i = 0; i < businessName.length; i++) {
    hash = ((hash << 5) - hash) + businessName.charCodeAt(i)
    hash = hash & hash
  }
  var isFound = Math.abs(hash % 10) > 4

  return {
    directory: "Instagram",
    status: isFound ? "found" : "not_found",
    icon: "📸",
    found_name: isFound ? businessName : undefined
  }
}

// Scan Yelp (simulated)
export async function scanYelp(businessName: string, location: string): Promise<DirectoryScanResult> {
  await new Promise(function(resolve) { setTimeout(resolve, 300) })
  
  var hash = 0
  for (var i = 0; i < businessName.length; i++) {
    hash = ((hash << 5) - hash) + businessName.charCodeAt(i)
    hash = hash & hash
  }
  var isFound = Math.abs(hash % 10) > 5

  return {
    directory: "Yelp",
    status: isFound ? "found" : "not_found",
    icon: "⭐"
  }
}

// Scan Bing Places (simulated)
export async function scanBing(businessName: string, location: string): Promise<DirectoryScanResult> {
  await new Promise(function(resolve) { setTimeout(resolve, 300) })
  
  var hash = 0
  for (var i = 0; i < businessName.length; i++) {
    hash = ((hash << 5) - hash) + businessName.charCodeAt(i)
    hash = hash & hash
  }
  var isFound = Math.abs(hash % 10) > 3

  return {
    directory: "Bing Places",
    status: isFound ? "found" : "not_found",
    icon: "🅱️"
  }
}

// Scan Apple Maps (simulated)
export async function scanAppleMaps(businessName: string, location: string): Promise<DirectoryScanResult> {
  await new Promise(function(resolve) { setTimeout(resolve, 300) })
  
  var hash = 0
  for (var i = 0; i < businessName.length; i++) {
    hash = ((hash << 5) - hash) + businessName.charCodeAt(i)
    hash = hash & hash
  }
  var isFound = Math.abs(hash % 10) > 5

  return {
    directory: "Apple Maps",
    status: isFound ? "found" : "not_found",
    icon: "🍎"
  }
}

// Run all directory scans
export async function scanAllDirectories(
  placeId: string,
  businessName: string,
  location: string,
  apiKey: string
): Promise<DirectoryScanResult[]> {
  var results = await Promise.all([
    scanGoogle(placeId, apiKey),
    scanFacebook(businessName, location),
    scanInstagram(businessName, location),
    scanYelp(businessName, location),
    scanBing(businessName, location),
    scanAppleMaps(businessName, location)
  ])

  return results
}

// Calculate health score from results
export function calculateHealthScore(results: DirectoryScanResult[]): number {
  var foundCount = results.filter(function(r) {
    return r.status === "found"
  }).length
  return Math.round((foundCount / results.length) * 100)
}