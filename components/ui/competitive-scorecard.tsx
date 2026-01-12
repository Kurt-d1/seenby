"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CompetitorAnalysis {
  business_name: string
  google: {
    rating: number | null
    review_count: number
    photos_count: number
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
  }
  overall_score: number
}

interface CompetitiveScorecardProps {
  yourAnalysis: CompetitorAnalysis
  competitorAnalyses: CompetitorAnalysis[]
  loading: boolean
}

export function CompetitiveScorecard(props: CompetitiveScorecardProps) {
  var yourAnalysis = props.yourAnalysis
  var competitorAnalyses = props.competitorAnalyses
  var loading = props.loading

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>📊 Competitive Scorecard</CardTitle>
          <CardDescription>Analyzing your competition...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-slate-500">Running comprehensive analysis...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (competitorAnalyses.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>📊 Competitive Scorecard</CardTitle>
          <CardDescription>No competitor data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Calculate averages and find leader
  var avgScore = Math.round(competitorAnalyses.reduce(function(sum, c) { return sum + c.overall_score }, 0) / competitorAnalyses.length)
  var leader = competitorAnalyses.reduce(function(best, c) { return c.overall_score > best.overall_score ? c : best })
  
  var avgRating = calculateAverage(competitorAnalyses.map(function(c) { return c.google.rating }))
  var avgReviews = Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.google.review_count })) || 0)
  var avgFbFollowers = Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.social.facebook_followers })) || 0)
  var avgIgFollowers = Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.social.instagram_followers })) || 0)
  var avgFbPosts = Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.social.facebook_posts_monthly })) || 0)
  var avgIgPosts = Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.social.instagram_posts_monthly })) || 0)
  var competitorsWithAds = competitorAnalyses.filter(function(c) { return c.social.facebook_has_ads || c.social.instagram_has_ads }).length
  var adsPercentage = Math.round((competitorsWithAds / competitorAnalyses.length) * 100)

  var gaps = findGaps(yourAnalysis, avgRating, avgReviews, avgFbFollowers, avgIgFollowers, avgFbPosts, avgIgPosts, adsPercentage)

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>📊 Competitive Scorecard</CardTitle>
        <CardDescription>
          How you compare to {competitorAnalyses.length} competitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall Score Comparison */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-4xl font-bold text-blue-600">{yourAnalysis.overall_score}</div>
            <div className="text-sm text-slate-600">Your Score</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-4xl font-bold text-slate-600">{avgScore}</div>
            <div className="text-sm text-slate-600">Competitor Avg</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-4xl font-bold text-green-600">{leader.overall_score}</div>
            <div className="text-sm text-slate-600">Leader</div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Metric</th>
                <th className="text-center py-2 px-2">You</th>
                <th className="text-center py-2 px-2">Avg</th>
                <th className="text-center py-2 px-2">Leader</th>
                <th className="text-center py-2 px-2">Gap</th>
              </tr>
            </thead>
            <tbody>
              {/* Google Section */}
              <tr className="bg-slate-50">
                <td colSpan={5} className="py-2 px-2 font-semibold">📍 Google</td>
              </tr>
              <MetricRow 
                label="Rating" 
                you={yourAnalysis.google.rating?.toFixed(1) || "N/A"} 
                avg={avgRating?.toFixed(1) || "N/A"}
                leader={leader.google.rating?.toFixed(1) || "N/A"}
                youValue={yourAnalysis.google.rating}
                avgValue={avgRating}
              />
              <MetricRow 
                label="Reviews" 
                you={yourAnalysis.google.review_count.toString()} 
                avg={avgReviews.toString()}
                leader={leader.google.review_count.toString()}
                youValue={yourAnalysis.google.review_count}
                avgValue={avgReviews}
              />
              <MetricRow 
                label="Photos" 
                you={yourAnalysis.google.photos_count.toString()} 
                avg={Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.google.photos_count })) || 0).toString()}
                leader={leader.google.photos_count.toString()}
                youValue={yourAnalysis.google.photos_count}
                avgValue={calculateAverage(competitorAnalyses.map(function(c) { return c.google.photos_count }))}
              />

              {/* Facebook Section */}
              <tr className="bg-slate-50">
                <td colSpan={5} className="py-2 px-2 font-semibold">📘 Facebook</td>
              </tr>
              <MetricRow 
                label="Followers" 
                you={formatNumber(yourAnalysis.social.facebook_followers)} 
                avg={formatNumber(avgFbFollowers)}
                leader={formatNumber(leader.social.facebook_followers)}
                youValue={yourAnalysis.social.facebook_followers}
                avgValue={avgFbFollowers}
              />
              <MetricRow 
                label="Posts/month" 
                you={(yourAnalysis.social.facebook_posts_monthly || 0).toString()} 
                avg={avgFbPosts.toString()}
                leader={(leader.social.facebook_posts_monthly || 0).toString()}
                youValue={yourAnalysis.social.facebook_posts_monthly}
                avgValue={avgFbPosts}
              />
              <MetricRow 
                label="Engagement %" 
                you={(yourAnalysis.social.facebook_engagement?.toFixed(1) || "0") + "%"} 
                avg={(calculateAverage(competitorAnalyses.map(function(c) { return c.social.facebook_engagement }))?.toFixed(1) || "0") + "%"}
                leader={(leader.social.facebook_engagement?.toFixed(1) || "0") + "%"}
                youValue={yourAnalysis.social.facebook_engagement}
                avgValue={calculateAverage(competitorAnalyses.map(function(c) { return c.social.facebook_engagement }))}
              />
              <tr className="border-b">
                <td className="py-2 px-2 text-slate-600">Running Ads</td>
                <td className="py-2 px-2 text-center font-medium">{yourAnalysis.social.facebook_has_ads ? "Yes ✓" : "No"}</td>
                <td className="py-2 px-2 text-center text-slate-500">{adsPercentage}%</td>
                <td className="py-2 px-2 text-center text-slate-500">{leader.social.facebook_has_ads ? "Yes" : "No"}</td>
                <td className={"py-2 px-2 text-center font-medium " + (!yourAnalysis.social.facebook_has_ads && adsPercentage > 40 ? "text-red-600" : "text-green-600")}>
                  {!yourAnalysis.social.facebook_has_ads && adsPercentage > 40 ? "⚠️" : "✓"}
                </td>
              </tr>

              {/* Instagram Section */}
              <tr className="bg-slate-50">
                <td colSpan={5} className="py-2 px-2 font-semibold">📸 Instagram</td>
              </tr>
              <MetricRow 
                label="Followers" 
                you={formatNumber(yourAnalysis.social.instagram_followers)} 
                avg={formatNumber(avgIgFollowers)}
                leader={formatNumber(leader.social.instagram_followers)}
                youValue={yourAnalysis.social.instagram_followers}
                avgValue={avgIgFollowers}
              />
              <MetricRow 
                label="Posts/month" 
                you={(yourAnalysis.social.instagram_posts_monthly || 0).toString()} 
                avg={avgIgPosts.toString()}
                leader={(leader.social.instagram_posts_monthly || 0).toString()}
                youValue={yourAnalysis.social.instagram_posts_monthly}
                avgValue={avgIgPosts}
              />
              <MetricRow 
                label="Engagement %" 
                you={(yourAnalysis.social.instagram_engagement?.toFixed(1) || "0") + "%"} 
                avg={(calculateAverage(competitorAnalyses.map(function(c) { return c.social.instagram_engagement }))?.toFixed(1) || "0") + "%"}
                leader={(leader.social.instagram_engagement?.toFixed(1) || "0") + "%"}
                youValue={yourAnalysis.social.instagram_engagement}
                avgValue={calculateAverage(competitorAnalyses.map(function(c) { return c.social.instagram_engagement }))}
              />

              {/* Website Section */}
              <tr className="bg-slate-50">
                <td colSpan={5} className="py-2 px-2 font-semibold">🌐 Website</td>
              </tr>
              <MetricRow 
                label="Speed Score" 
                you={(yourAnalysis.website.speed_score || 0).toString()} 
                avg={Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.website.speed_score })) || 0).toString()}
                leader={(leader.website.speed_score || 0).toString()}
                youValue={yourAnalysis.website.speed_score}
                avgValue={calculateAverage(competitorAnalyses.map(function(c) { return c.website.speed_score }))}
              />
              <MetricRow 
                label="SEO Score" 
                you={(yourAnalysis.website.seo_score || 0).toString()} 
                avg={Math.round(calculateAverage(competitorAnalyses.map(function(c) { return c.website.seo_score })) || 0).toString()}
                leader={(leader.website.seo_score || 0).toString()}
                youValue={yourAnalysis.website.seo_score}
                avgValue={calculateAverage(competitorAnalyses.map(function(c) { return c.website.seo_score }))}
              />
            </tbody>
          </table>
        </div>

        {/* Critical Gaps */}
        {gaps.length > 0 && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">🔴 Critical Gaps</h4>
            <ul className="space-y-1">
              {gaps.map(function(gap, index) {
                return <li key={index} className="text-sm text-red-700">• {gap}</li>
              })}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Recommendations</h4>
          <ul className="space-y-1">
            {generateRecommendations(yourAnalysis, avgReviews, avgFbPosts, avgIgPosts, adsPercentage).map(function(rec, index) {
              return <li key={index} className="text-sm text-blue-700">• {rec}</li>
            })}
          </ul>
        </div>

        {/* Ad Library Link */}
        {yourAnalysis.social.ad_library_url && (
          <div className="mt-4 text-center">
            <a 
              href={yourAnalysis.social.ad_library_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              🔍 View competitor ads in Meta Ad Library →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MetricRow(props: {
  label: string
  you: string
  avg: string
  leader: string
  youValue: number | null | undefined
  avgValue: number | null | undefined
}) {
  var gapColor = "text-slate-500"
  var gapText = "-"
  
  if (props.youValue !== null && props.youValue !== undefined && props.avgValue !== null && props.avgValue !== undefined) {
    var diff = props.youValue - props.avgValue
    if (diff > 0) {
      gapText = "+" + formatNumber(diff)
      gapColor = "text-green-600"
    } else if (diff < 0) {
      gapText = formatNumber(diff)
      gapColor = "text-red-600"
    } else {
      gapText = "0"
    }
  }

  return (
    <tr className="border-b">
      <td className="py-2 px-2 text-slate-600">{props.label}</td>
      <td className="py-2 px-2 text-center font-medium">{props.you}</td>
      <td className="py-2 px-2 text-center text-slate-500">{props.avg}</td>
      <td className="py-2 px-2 text-center text-slate-500">{props.leader}</td>
      <td className={"py-2 px-2 text-center font-medium " + gapColor}>{gapText}</td>
    </tr>
  )
}

function calculateAverage(values: (number | null | undefined)[]): number | null {
  var validValues = values.filter(function(v): v is number { return v !== null && v !== undefined })
  if (validValues.length === 0) return null
  return validValues.reduce(function(sum, v) { return sum + v }, 0) / validValues.length
}

function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A"
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "k"
  return Math.round(num).toString()
}

function findGaps(you: CompetitorAnalysis, avgRating: number | null, avgReviews: number, avgFbFollowers: number, avgIgFollowers: number, avgFbPosts: number, avgIgPosts: number, adsPercentage: number): string[] {
  var gaps: string[] = []

  if (you.google.rating && avgRating && you.google.rating < avgRating - 0.3) {
    gaps.push("Google rating below average (" + you.google.rating.toFixed(1) + " vs " + avgRating.toFixed(1) + ")")
  }

  if (you.google.review_count < avgReviews * 0.5 && avgReviews > 0) {
    gaps.push("Competitors have significantly more Google reviews")
  }

  if ((you.social.facebook_followers || 0) < avgFbFollowers * 0.5 && avgFbFollowers > 0) {
    gaps.push("Facebook following is below average")
  }

  if ((you.social.instagram_followers || 0) < avgIgFollowers * 0.5 && avgIgFollowers > 0) {
    gaps.push("Instagram following is below average")
  }

  if (!you.social.facebook_has_ads && !you.social.instagram_has_ads && adsPercentage > 40) {
    gaps.push(adsPercentage + "% of competitors run Meta ads but you do not")
  }

  return gaps
}

function generateRecommendations(you: CompetitorAnalysis, avgReviews: number, avgFbPosts: number, avgIgPosts: number, adsPercentage: number): string[] {
  var recs: string[] = []

  if (you.google.review_count < avgReviews) {
    recs.push("Start a review campaign. Ask happy customers for Google reviews")
  }

  if ((you.social.facebook_posts_monthly || 0) < avgFbPosts) {
    recs.push("Increase Facebook posting to " + Math.max(avgFbPosts, 8) + "+ times per month")
  }

  if ((you.social.instagram_posts_monthly || 0) < avgIgPosts) {
    recs.push("Post on Instagram at least " + Math.max(avgIgPosts, 12) + " times per month")
  }

  if (!you.social.facebook_has_ads && adsPercentage > 30) {
    recs.push("Consider Meta ads. " + adsPercentage + "% of competitors invest here")
  }

  if (!you.website.accessible) {
    recs.push("Create a website. Essential for online visibility")
  } else if ((you.website.speed_score || 0) < 50) {
    recs.push("Improve website speed. Slow sites hurt SEO")
  }

  if (recs.length === 0) {
    recs.push("You are performing well! Focus on consistency.")
  }

  return recs
}