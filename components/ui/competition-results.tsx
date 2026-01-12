"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Competitor {
  name: string
  address: string
  rating: number | null
  review_count: number
  health_score: number
  directories_found: number
  directories_checked: number
}

interface CompetitionResultsProps {
  yourScore: number
  competitors: Competitor[]
  averageScore: number
  loading: boolean
}

export function CompetitionResults(props: CompetitionResultsProps) {
  var yourScore = props.yourScore
  var competitors = props.competitors
  var averageScore = props.averageScore
  var loading = props.loading

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Competition Analysis</CardTitle>
          <CardDescription>Analyzing nearby competitors...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-slate-500">Scanning competitors...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (competitors.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Competition Analysis</CardTitle>
          <CardDescription>No nearby competitors found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  var yourPercentile = calculatePercentile(yourScore, competitors)

  function getComparisonMessage() {
    if (yourScore > averageScore + 10) {
      return "You are outperforming your competition!"
    }
    if (yourScore >= averageScore - 10) {
      return "You are on par with your competition."
    }
    return "Your competitors have better online visibility."
  }

  function getComparisonColor() {
    if (yourScore > averageScore + 10) return "text-green-600"
    if (yourScore >= averageScore - 10) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Competition Analysis</CardTitle>
        <CardDescription>
          How you compare to {competitors.length} nearby competitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">{yourScore}</div>
              <div className="text-sm text-slate-500">Your Score</div>
            </div>
            <div className="text-center">
              <div className={"text-lg font-semibold " + getComparisonColor()}>
                {yourScore > averageScore ? "+" : ""}{yourScore - averageScore}
              </div>
              <div className="text-sm text-slate-500">vs Average</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-400">{averageScore}</div>
              <div className="text-sm text-slate-500">Competitor Avg</div>
            </div>
          </div>
          <p className={"text-center font-medium " + getComparisonColor()}>
            {getComparisonMessage()}
          </p>
          <p className="text-center text-sm text-slate-500 mt-1">
            You rank better than {yourPercentile}% of nearby competitors
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-24 text-sm font-medium text-slate-600">You</div>
            <div className="flex-1 bg-slate-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                style={{ width: yourScore + "%" }}
              >
                <span className="text-xs text-white font-medium">{yourScore}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium text-slate-600">Competitors</div>
            <div className="flex-1 bg-slate-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-slate-400 h-full rounded-full flex items-center justify-end pr-2"
                style={{ width: averageScore + "%" }}
              >
                <span className="text-xs text-white font-medium">{averageScore}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-slate-700 mb-3">Nearby Competitors</h4>
          <div className="space-y-3">
            {competitors.map(function(competitor, index) {
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{competitor.name}</div>
                    <div className="text-sm text-slate-500">
                      {competitor.rating && (
                        <span className="mr-3">⭐ {competitor.rating}</span>
                      )}
                      <span>{competitor.review_count} reviews</span>
                      <span className="mx-2">•</span>
                      <span>{competitor.directories_found}/{competitor.directories_checked} directories</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={
                      "text-xl font-bold " + 
                      (competitor.health_score < yourScore ? "text-green-600" : 
                       competitor.health_score > yourScore ? "text-red-600" : "text-slate-600")
                    }>
                      {competitor.health_score}
                    </div>
                    <div className="text-xs text-slate-500">score</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function calculatePercentile(yourScore: number, competitors: Competitor[]): number {
  var scoresBelow = competitors.filter(function(c) {
    return c.health_score < yourScore
  }).length
  return Math.round((scoresBelow / competitors.length) * 100)
}