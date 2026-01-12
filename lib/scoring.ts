export interface ScoringInput {
  google: {
    rating: number | null
    review_count: number
  }
  social: {
    facebook_followers: number
    facebook_posts_monthly: number
    facebook_engagement: number
    facebook_has_ads: boolean
    instagram_followers: number
    instagram_posts_monthly: number
    instagram_engagement: number
    instagram_has_ads: boolean
  }
  website: {
    speed_score: number
    seo_score: number
    has_ssl: boolean
  }
}

export function calculateVisibilityScore(input: ScoringInput): number {
  var score = 0

  // Google Business (35 points max)
  // Rating: up to 15 points (5.0 = 15 points)
  if (input.google.rating) {
    score += (input.google.rating / 5) * 15
  }
  
  // Reviews: up to 20 points (logarithmic scale)
  // 1 review = ~0 points, 10 reviews = ~7 points, 100 reviews = ~13 points, 500+ reviews = 20 points
  if (input.google.review_count > 0) {
    var reviewScore = Math.min(20, Math.log10(input.google.review_count + 1) * 7.5)
    score += reviewScore
  }

  // Social Media (40 points max)
  // Facebook followers: up to 10 points (5000+ = full points)
  var fbFollowerScore = Math.min(10, (input.social.facebook_followers / 5000) * 10)
  score += fbFollowerScore

  // Facebook activity: up to 5 points (posting regularly)
  var fbActivityScore = Math.min(5, (input.social.facebook_posts_monthly / 12) * 5)
  score += fbActivityScore

  // Facebook engagement: up to 3 points
  var fbEngagementScore = Math.min(3, (input.social.facebook_engagement / 5) * 3)
  score += fbEngagementScore

  // Facebook ads: 2 points bonus
  if (input.social.facebook_has_ads) {
    score += 2
  }

  // Instagram followers: up to 10 points (4000+ = full points)
  var igFollowerScore = Math.min(10, (input.social.instagram_followers / 4000) * 10)
  score += igFollowerScore

  // Instagram activity: up to 5 points
  var igActivityScore = Math.min(5, (input.social.instagram_posts_monthly / 12) * 5)
  score += igActivityScore

  // Instagram engagement: up to 3 points
  var igEngagementScore = Math.min(3, (input.social.instagram_engagement / 6) * 3)
  score += igEngagementScore

  // Instagram ads: 2 points bonus
  if (input.social.instagram_has_ads) {
    score += 2
  }

  // Website (25 points max)
  // Speed score: up to 10 points
  var speedScore = (input.website.speed_score / 100) * 10
  score += speedScore

  // SEO score: up to 10 points
  var seoScorePoints = (input.website.seo_score / 100) * 10
  score += seoScorePoints

  // SSL: 5 points
  if (input.website.has_ssl) {
    score += 5
  }

  return Math.min(100, Math.round(score))
}