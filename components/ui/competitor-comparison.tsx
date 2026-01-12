"use client"

import { Button } from "./button"
import { ScoreRing } from "./score-ring"

interface CompetitorAnalysis {
  place_id: string
  name: string
  address: string
  google: {
    rating: number | null
    review_count: number
    photos_count: number
  }
  social: {
    facebook_followers: number
    facebook_posts_monthly: number
    facebook_engagement: string
    facebook_has_ads: boolean
    instagram_followers: number
    instagram_posts_monthly: number
    instagram_engagement: string
    instagram_has_ads: boolean
  }
  website: {
    speed_score: number
    seo_score: number
    has_ssl: boolean
  }
  overall_score: number
}

interface YourAnalysis {
  name: string
  google: {
    rating: number | null
    review_count: number
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
  }
  website: {
    speed_score: number | null
    seo_score: number | null
  }
  overall_score: number
}

interface CompetitorComparisonProps {
  yourAnalysis: YourAnalysis
  competitors: CompetitorAnalysis[]
  onBack: () => void
  onNewSearch: () => void
}

interface UnifiedEntry {
  id: string
  name: string
  isYou: boolean
  score: number
  rating: number | null
  reviews: number
  fbFollowers: number
  fbPosts: number
  fbEngagement: number
  fbAds: boolean
  igFollowers: number
  igPosts: number
  igEngagement: number
  igAds: boolean
  webSpeed: number
  seoScore: number
}

export function CompetitorComparison({ yourAnalysis, competitors, onBack, onNewSearch }: CompetitorComparisonProps) {
  // Convert your analysis to unified format
  var yourEntry: UnifiedEntry = {
    id: "you",
    name: yourAnalysis.name,
    isYou: true,
    score: yourAnalysis.overall_score,
    rating: yourAnalysis.google.rating,
    reviews: yourAnalysis.google.review_count,
    fbFollowers: yourAnalysis.social.facebook_followers || 0,
    fbPosts: yourAnalysis.social.facebook_posts_monthly || 0,
    fbEngagement: yourAnalysis.social.facebook_engagement || 0,
    fbAds: yourAnalysis.social.facebook_has_ads,
    igFollowers: yourAnalysis.social.instagram_followers || 0,
    igPosts: yourAnalysis.social.instagram_posts_monthly || 0,
    igEngagement: yourAnalysis.social.instagram_engagement || 0,
    igAds: yourAnalysis.social.instagram_has_ads,
    webSpeed: yourAnalysis.website.speed_score || 0,
    seoScore: yourAnalysis.website.seo_score || 0
  }

  // Convert competitors to unified format
  var competitorEntries: UnifiedEntry[] = competitors.map(function(c) {
    return {
      id: c.place_id,
      name: c.name,
      isYou: false,
      score: c.overall_score,
      rating: c.google.rating,
      reviews: c.google.review_count,
      fbFollowers: c.social.facebook_followers,
      fbPosts: c.social.facebook_posts_monthly,
      fbEngagement: parseFloat(c.social.facebook_engagement),
      fbAds: c.social.facebook_has_ads,
      igFollowers: c.social.instagram_followers,
      igPosts: c.social.instagram_posts_monthly,
      igEngagement: parseFloat(c.social.instagram_engagement),
      igAds: c.social.instagram_has_ads,
      webSpeed: c.website.speed_score,
      seoScore: c.website.seo_score
    }
  })

  // All entries including you
  var allEntries = [yourEntry, ...competitorEntries]

  // Sort by overall score for column ordering
  var sortedByScore = [...allEntries].sort(function(a, b) {
    return b.score - a.score
  })

  // Find your rank
  var yourRank = sortedByScore.findIndex(function(e) { return e.isYou }) + 1
  var isYouLeader = yourRank === 1

  // Competitors only (for averages)
  var competitorOnly = allEntries.filter(function(e) { return !e.isYou })

  // Calculate averages from competitors only
  function avg(arr: number[]): number {
    if (arr.length === 0) return 0
    return arr.reduce(function(a, b) { return a + b }, 0) / arr.length
  }

  var avgScore = Math.round(avg(competitorOnly.map(function(c) { return c.score })))
  var avgRating = avg(competitorOnly.map(function(c) { return c.rating || 0 }))
  var avgReviews = Math.round(avg(competitorOnly.map(function(c) { return c.reviews })))
  var avgFbFollowers = Math.round(avg(competitorOnly.map(function(c) { return c.fbFollowers })))
  var avgFbPosts = Math.round(avg(competitorOnly.map(function(c) { return c.fbPosts })))
  var avgFbEngagement = avg(competitorOnly.map(function(c) { return c.fbEngagement }))
  var avgIgFollowers = Math.round(avg(competitorOnly.map(function(c) { return c.igFollowers })))
  var avgIgPosts = Math.round(avg(competitorOnly.map(function(c) { return c.igPosts })))
  var avgIgEngagement = avg(competitorOnly.map(function(c) { return c.igEngagement }))
  var avgWebSpeed = Math.round(avg(competitorOnly.map(function(c) { return c.webSpeed })))
  var avgSeoScore = Math.round(avg(competitorOnly.map(function(c) { return c.seoScore })))

  var competitorsWithAds = competitorOnly.filter(function(c) { return c.fbAds || c.igAds }).length
  var adsPercentage = competitorOnly.length > 0 
    ? Math.round((competitorsWithAds / competitorOnly.length) * 100) 
    : 0

  // Top competitor (highest scoring non-you)
  var topCompetitor = competitorOnly.length > 0 
    ? competitorOnly.sort(function(a, b) { return b.score - a.score })[0] 
    : null

  // Find the BEST value for each metric across ALL entries (including you)
  function findBest(metric: string): string {
    var bestValue = -Infinity
    var bestId = ""
    
    allEntries.forEach(function(e) {
      var val = 0
      if (metric === "score") val = e.score
      else if (metric === "rating") val = e.rating || 0
      else if (metric === "reviews") val = e.reviews
      else if (metric === "fbFollowers") val = e.fbFollowers
      else if (metric === "fbPosts") val = e.fbPosts
      else if (metric === "fbEngagement") val = e.fbEngagement
      else if (metric === "igFollowers") val = e.igFollowers
      else if (metric === "igPosts") val = e.igPosts
      else if (metric === "igEngagement") val = e.igEngagement
      else if (metric === "webSpeed") val = e.webSpeed
      else if (metric === "seoScore") val = e.seoScore
      
      if (val > bestValue) {
        bestValue = val
        bestId = e.id
      }
    })
    
    return bestId
  }

  function formatNumber(num: number | null): string {
    if (num === null) return "N/A"
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "k"
    return num.toString()
  }

  function getComparisonColor(yours: number, compare: number): string {
    if (yours > compare) return "text-green-600"
    if (yours < compare) return "text-red-600"
    return "text-slate-600"
  }

  function getDifferenceDisplay(yours: number, compare: number, isDecimal?: boolean): string {
    var diff = yours - compare
    if (isDecimal) {
      if (Math.abs(diff) < 0.1) return "="
      if (diff > 0) return "↑ +" + diff.toFixed(1)
      return "↓ " + diff.toFixed(1)
    }
    if (diff === 0) return "="
    if (diff > 0) return "↑ +" + formatNumber(diff)
    return "↓ -" + formatNumber(Math.abs(diff))
  }

  // Render a metric row
  function renderMetricRow(
    label: string, 
    metricKey: string,
    getValue: (e: UnifiedEntry) => number | null,
    avgValue: number,
    topCompValue: number,
    isDecimal?: boolean
  ) {
    var bestId = findBest(metricKey)
    var yourValue = getValue(yourEntry) || 0
    
    return (
      <tr key={metricKey} className="border-b border-slate-100 hover:bg-slate-50">
        <td className="py-3 px-3 text-sm text-slate-600 bg-slate-50 sticky left-0">{label}</td>
        {sortedByScore.map(function(entry) {
          var value = getValue(entry)
          var isBest = entry.id === bestId && (value || 0) > 0
          var displayValue = isDecimal 
            ? (value !== null ? value.toFixed(1) + (metricKey.includes("Engagement") ? "%" : "") : "N/A")
            : formatNumber(value)
          
          var cellClass = "py-3 px-3 text-center text-sm "
          if (entry.isYou) {
            cellClass += "bg-indigo-50 font-semibold text-indigo-700 "
          } else if (sortedByScore.indexOf(entry) === 0 && !sortedByScore[0].isYou) {
            cellClass += "bg-yellow-50 "
          }
          
          return (
            <td key={entry.id} className={cellClass}>
              {displayValue}
              {isBest && <span className="ml-1">🥇</span>}
            </td>
          )
        })}
        <td className="py-3 px-3 text-center text-sm bg-slate-200 font-medium">
          {isDecimal ? avgValue.toFixed(1) : formatNumber(avgValue)}
        </td>
        <td className={"py-3 px-3 text-center text-sm font-medium bg-green-100 " + getComparisonColor(yourValue, avgValue)}>
          {getDifferenceDisplay(yourValue, avgValue, isDecimal)}
        </td>
        <td className={"py-3 px-3 text-center text-sm font-medium bg-orange-100 " + getComparisonColor(yourValue, topCompValue)}>
          {getDifferenceDisplay(yourValue, topCompValue, isDecimal)}
        </td>
      </tr>
    )
  }

  // Render ads row (special case - boolean)
  function renderAdsRow() {
    return (
      <tr className="border-b border-slate-100 hover:bg-slate-50">
        <td className="py-3 px-3 text-sm text-slate-600 bg-slate-50 sticky left-0">Running Ads</td>
        {sortedByScore.map(function(entry) {
          var cellClass = "py-3 px-3 text-center text-sm "
          if (entry.isYou) {
            cellClass += "bg-indigo-50 "
          } else if (sortedByScore.indexOf(entry) === 0 && !sortedByScore[0].isYou) {
            cellClass += "bg-yellow-50 "
          }
          
          return (
            <td key={entry.id} className={cellClass}>
              <span className={entry.fbAds ? "text-green-600 font-medium" : "text-red-500"}>
                {entry.fbAds ? "Yes ✓" : "No ✗"}
              </span>
            </td>
          )
        })}
        <td className="py-3 px-3 text-center text-sm bg-slate-200 font-medium">{adsPercentage}%</td>
        <td className="py-3 px-3 text-center text-sm bg-green-100 text-slate-400">—</td>
        <td className="py-3 px-3 text-center text-sm bg-orange-100 text-slate-400">—</td>
      </tr>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Competitive Analysis</h2>
          <p className="text-slate-500">Comparing {yourAnalysis.name} against {competitorOnly.length} competitor{competitorOnly.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNewSearch}>New Search</Button>
          <Button variant="outline" onClick={onBack}>Close</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
          <ScoreRing score={yourEntry.score} size="md" />
          <div className="mt-3 font-semibold text-slate-800">Your Score</div>
          <div className="text-sm text-slate-500">
            {isYouLeader ? (
              <span className="text-green-600 font-medium">🏆 #1 - You're Leading!</span>
            ) : (
              <span>Rank #{yourRank} of {allEntries.length}</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
          <div className="text-5xl font-bold text-slate-400 mb-2">{avgScore}</div>
          <div className="font-semibold text-slate-800">Competitor Avg</div>
          <div className={"text-sm font-medium " + (yourEntry.score >= avgScore ? "text-green-600" : "text-red-600")}>
            {yourEntry.score >= avgScore ? "Above average!" : "Below average"}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
          <div className="text-5xl font-bold text-yellow-500 mb-2">{topCompetitor?.score || 0}</div>
          <div className="font-semibold text-slate-800">Top Competitor</div>
          <div className="text-sm text-slate-500 truncate" title={topCompetitor?.name}>{topCompetitor?.name || "N/A"}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
          <div className="text-5xl font-bold text-indigo-500 mb-2">{adsPercentage}%</div>
          <div className="font-semibold text-slate-800">Running Ads</div>
          <div className="text-sm text-slate-500">{competitorsWithAds} of {competitorOnly.length}</div>
        </div>
      </div>

      {/* Full Comparison Matrix */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📊 Full Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600 bg-slate-50 sticky left-0 min-w-[140px]">Metric</th>
                {sortedByScore.map(function(entry, index) {
                  var isTopCompetitor = index === 0 && !entry.isYou
                  var bgClass = entry.isYou 
                    ? "bg-indigo-600 text-white" 
                    : isTopCompetitor 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-slate-50 text-slate-600"
                  
                  return (
                    <th key={entry.id} className={"py-3 px-3 text-sm font-semibold min-w-[110px] " + bgClass}>
                      <div className="truncate" title={entry.name}>
                        {entry.isYou ? "You" : (entry.name.length > 12 ? entry.name.substring(0, 12) + "..." : entry.name)}
                      </div>
                      <div className="text-xs font-normal opacity-80">
                        {entry.isYou ? "(Your Business)" : "#" + (index + 1)}
                      </div>
                    </th>
                  )
                })}
                <th className="py-3 px-3 text-sm font-semibold text-slate-600 bg-slate-200 min-w-[80px]">AVG</th>
                <th className="py-3 px-3 text-sm font-semibold text-slate-600 bg-green-100 min-w-[90px]">vs Avg</th>
                <th className="py-3 px-3 text-sm font-semibold text-slate-600 bg-orange-100 min-w-[90px]">vs Top</th>
              </tr>
            </thead>
            <tbody>
              {/* Overall Section */}
              <tr className="bg-slate-100">
                <td colSpan={sortedByScore.length + 4} className="py-2 px-3 text-sm font-semibold text-slate-700">📈 Overall</td>
              </tr>
              {renderMetricRow("Visibility Score", "score", function(e) { return e.score }, avgScore, topCompetitor?.score || 0)}

              {/* Google Section */}
              <tr className="bg-slate-100">
                <td colSpan={sortedByScore.length + 4} className="py-2 px-3 text-sm font-semibold text-slate-700">📍 Google Business</td>
              </tr>
              {renderMetricRow("Rating", "rating", function(e) { return e.rating }, avgRating, topCompetitor?.rating || 0, true)}
              {renderMetricRow("Reviews", "reviews", function(e) { return e.reviews }, avgReviews, topCompetitor?.reviews || 0)}

              {/* Facebook Section */}
              <tr className="bg-slate-100">
                <td colSpan={sortedByScore.length + 4} className="py-2 px-3 text-sm font-semibold text-slate-700">📘 Facebook</td>
              </tr>
              {renderMetricRow("Followers", "fbFollowers", function(e) { return e.fbFollowers }, avgFbFollowers, topCompetitor?.fbFollowers || 0)}
              {renderMetricRow("Posts/Month", "fbPosts", function(e) { return e.fbPosts }, avgFbPosts, topCompetitor?.fbPosts || 0)}
              {renderMetricRow("Engagement %", "fbEngagement", function(e) { return e.fbEngagement }, avgFbEngagement, topCompetitor?.fbEngagement || 0, true)}
              {renderAdsRow()}

              {/* Instagram Section */}
              <tr className="bg-slate-100">
                <td colSpan={sortedByScore.length + 4} className="py-2 px-3 text-sm font-semibold text-slate-700">📸 Instagram</td>
              </tr>
              {renderMetricRow("Followers", "igFollowers", function(e) { return e.igFollowers }, avgIgFollowers, topCompetitor?.igFollowers || 0)}
              {renderMetricRow("Posts/Month", "igPosts", function(e) { return e.igPosts }, avgIgPosts, topCompetitor?.igPosts || 0)}
              {renderMetricRow("Engagement %", "igEngagement", function(e) { return e.igEngagement }, avgIgEngagement, topCompetitor?.igEngagement || 0, true)}

              {/* Website Section */}
              <tr className="bg-slate-100">
                <td colSpan={sortedByScore.length + 4} className="py-2 px-3 text-sm font-semibold text-slate-700">🌐 Website</td>
              </tr>
              {renderMetricRow("Speed Score", "webSpeed", function(e) { return e.webSpeed }, avgWebSpeed, topCompetitor?.webSpeed || 0)}
              {renderMetricRow("SEO Score", "seoScore", function(e) { return e.seoScore }, avgSeoScore, topCompetitor?.seoScore || 0)}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-600 rounded"></span> You</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 rounded border border-yellow-300"></span> Top competitor</div>
          <div className="flex items-center gap-1"><span>🥇</span> Best in metric</div>
          <div className="flex items-center gap-1"><span className="text-green-600 font-bold">↑</span> You're higher</div>
          <div className="flex items-center gap-1"><span className="text-red-600 font-bold">↓</span> You're lower</div>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">💡 Priority Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isYouLeader && (
            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <div className="font-medium text-green-700 mb-1">🏆 You're the Leader!</div>
              <p className="text-sm text-slate-600">Great job! Focus on maintaining your position and growing your advantage.</p>
            </div>
          )}
          {yourEntry.reviews < avgReviews && (
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-slate-800 mb-1">📝 Get More Reviews</div>
              <p className="text-sm text-slate-600">You have {Math.round(avgReviews - yourEntry.reviews)} fewer reviews than average. Ask satisfied customers to leave a review.</p>
            </div>
          )}
          {yourEntry.fbFollowers < avgFbFollowers && (
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-slate-800 mb-1">📘 Grow Facebook</div>
              <p className="text-sm text-slate-600">Competitors average {formatNumber(avgFbFollowers)} followers. Run engagement campaigns to grow your audience.</p>
            </div>
          )}
          {yourEntry.igFollowers < avgIgFollowers && (
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-slate-800 mb-1">📸 Boost Instagram</div>
              <p className="text-sm text-slate-600">You're {formatNumber(avgIgFollowers - yourEntry.igFollowers)} followers behind average.</p>
            </div>
          )}
          {!yourEntry.fbAds && adsPercentage > 30 && (
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-slate-800 mb-1">📣 Consider Advertising</div>
              <p className="text-sm text-slate-600">{adsPercentage}% of competitors run Meta ads. You might be missing out.</p>
            </div>
          )}
          {yourEntry.webSpeed < avgWebSpeed && (
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-slate-800 mb-1">🚀 Improve Website Speed</div>
              <p className="text-sm text-slate-600">Your website performance ({yourEntry.webSpeed}) is below average ({avgWebSpeed}).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}