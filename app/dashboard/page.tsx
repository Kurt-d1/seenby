"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricCard } from "@/components/ui/metric-card"
import { ScoreRing } from "@/components/ui/score-ring"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  var trackedBusinesses = [
    {
      id: "1",
      name: "Vecchia Napoli",
      category: "Restaurant",
      score: 67,
      previousScore: 63,
      rank: 5,
      totalCompetitors: 6,
      lastScan: "2 hours ago",
      alerts: 2
    }
  ]

  var weeklyHighlights = [
    { type: "positive", message: "Gained 12 new Google reviews across all businesses" },
    { type: "warning", message: "2 competitors started new Meta ad campaigns" },
    { type: "positive", message: "Vecchia Napoli moved up 1 position in rankings" },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Good morning, Kurt!</h1>
        <p className="text-slate-500">Here is what is happening with your businesses today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon="📊"
          label="Avg Visibility Score"
          value="67"
          trend={{ value: 6, label: "vs last month" }}
          color="blue"
        />
        <MetricCard
          icon="⭐"
          label="Total Google Reviews"
          value="156"
          trend={{ value: 12, label: "this month" }}
          color="yellow"
        />
        <MetricCard
          icon="👥"
          label="Social Followers"
          value="2.1k"
          trend={{ value: 8, label: "growth" }}
          color="purple"
        />
        <MetricCard
          icon="🔔"
          label="Active Alerts"
          value="2"
          subValue="Needs attention"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Your Tracked Businesses</h2>
              <Link href="/">
                <Button variant="outline" size="sm">+ Add Business</Button>
              </Link>
            </div>

            <div className="space-y-4">
              {trackedBusinesses.map(function(business) {
                var scoreChange = business.score - business.previousScore
                return (
                  <div 
                    key={business.id}
                    className="border border-slate-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <ScoreRing score={business.score} size="sm" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{business.name}</h3>
                          {business.alerts > 0 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                              {business.alerts} alerts
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{business.category}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className={scoreChange >= 0 ? "text-green-500" : "text-red-500"}>
                            {scoreChange >= 0 ? "+" : ""}{scoreChange} pts this month
                          </span>
                          <span className="text-slate-400">
                            Rank: {business.rank} of {business.totalCompetitors}
                          </span>
                          <span className="text-slate-400">
                            Last scan: {business.lastScan}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={"/business/" + business.id}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Button size="sm">Scan Now</Button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {trackedBusinesses.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="font-medium text-slate-800 mb-2">No businesses tracked yet</h3>
                  <p className="text-slate-500 text-sm mb-4">Start by searching for your business</p>
                  <Link href="/">
                    <Button>Search for Business</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Weekly Highlights</h2>
            <div className="space-y-3">
              {weeklyHighlights.map(function(highlight, index) {
                var icon = highlight.type === "positive" ? "🟢" : highlight.type === "warning" ? "🟡" : "🔴"
                return (
                  <div key={index} className="flex gap-3 text-sm">
                    <span>{icon}</span>
                    <span className="text-slate-600">{highlight.message}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/" className="block">
                <Button variant="outline" className="w-full justify-start">
                  🔍 New Business Audit
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                📊 Download Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                👥 View All Competitors
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">Unlock More Insights</h3>
            <p className="text-sm text-indigo-100 mb-4">
              Track up to 5 businesses and 10 competitors with Pro.
            </p>
            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
              Upgrade to Pro - $19/mo
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}