import { NextRequest, NextResponse } from "next/server"
import { scanGoogleEnhanced } from "@/lib/directories"
import { analyzeSocialPresence } from "@/lib/social-analysis"
import { quickWebsiteCheck, analyzeWebsite } from "@/lib/website-analysis"

export interface ComprehensiveAnalysis {
  business_name: string
  google: {
    rating: number | null
    review_count: number
    photos_count: number
    has_website: boolean
    google_maps_url: string | null
  }
  social: {
    facebook_followers: number | null
    facebook_posts_monthly: number | null
    facebook_engagement: number | null
    facebook_has_ads: boolean
    instagram_followers: number | null
    instagram_posts_monthly: number | null
    instagram_engagement: number | null
    instagram_has_ads: boolean
    social_score: number
    ad_library_url: string | null
  }
  website: {
    accessible: boolean
    speed_score: number | null
    seo_score: number | null
    has_ssl: boolean
    mobile_friendly: boolean | null
  }
  overall_score: number
}

export async function POST(request: NextRequest) {
  try {
    var body = await request.json()
    var { place_id, name, website, country } = body

    var apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Comprehensive analysis for:", name)

    // 1. Enhanced Google Business data
    var googleData = await scanGoogleEnhanced(place_id, apiKey)
    
    // 2. Social media analysis
    var socialData = await analyzeSocialPresence(name, website, country || "MT")
    
    // 3. Website analysis (if they have one)
    var websiteData = null
    var websiteUrl = website || googleData?.website
    if (websiteUrl) {
      websiteData = await quickWebsiteCheck(websiteUrl)
    }

    // Calculate overall score
    var overallScore = calculateOverallScore(googleData, socialData, websiteData)

    var analysis: ComprehensiveAnalysis = {
      business_name: name,
      google: {
        rating: googleData?.rating || null,
        review_count: googleData?.review_count || 0,
        photos_count: googleData?.photos_count || 0,
        has_website: !!(googleData?.website),
        google_maps_url: googleData?.google_maps_url || null
      },
      social: {
        facebook_followers: socialData.facebook.followers,
        facebook_posts_monthly: socialData.facebook.posts_last_30_days,
        facebook_engagement: socialData.facebook.engagement_rate,
        facebook_has_ads: socialData.facebook.has_active_ads,
        instagram_followers: socialData.instagram.followers,
        instagram_posts_monthly: socialData.instagram.posts_last_30_days,
        instagram_engagement: socialData.instagram.engagement_rate,
        instagram_has_ads: socialData.instagram.has_active_ads,
        social_score: socialData.social_score,
        ad_library_url: socialData.facebook.ad_library_url
      },
      website: {
        accessible: websiteData?.accessible || false,
        speed_score: websiteData?.speed_score || null,
        seo_score: websiteData?.seo_score || null,
        has_ssl: websiteData?.has_ssl || false,
        mobile_friendly: websiteData?.mobile_friendly || null
      },
      overall_score: overallScore
    }

    return NextResponse.json(analysis)

  } catch (error) {
    console.error("Comprehensive analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

function calculateOverallScore(
  google: any,
  social: any,
  website: any
): number {
  var score = 0
  var maxScore = 100

  // Google presence (35 points)
  if (google) {
    // Rating (15 points)
    if (google.rating) {
      score += Math.min(15, (google.rating / 5) * 15)
    }
    // Reviews (10 points)
    if (google.review_count > 100) score += 10
    else if (google.review_count > 50) score += 8
    else if (google.review_count > 20) score += 6
    else if (google.review_count > 5) score += 4
    else if (google.review_count > 0) score += 2
    
    // Photos (5 points)
    if (google.photos_count > 20) score += 5
    else if (google.photos_count > 10) score += 4
    else if (google.photos_count > 5) score += 3
    else if (google.photos_count > 0) score += 1
    
    // Has website (5 points)
    if (google.website) score += 5
  }

  // Social presence (40 points) - use the calculated social score
  score += Math.round(social.social_score * 0.4)

  // Website (25 points)
  if (website && website.accessible) {
    score += 10 // Website exists and loads
    
    if (website.has_ssl) score += 5
    
    if (website.speed_score) {
      score += Math.round((website.speed_score / 100) * 5)
    }
    
    if (website.seo_score) {
      score += Math.round((website.seo_score / 100) * 5)
    }
  }

  return Math.min(100, Math.round(score))
}