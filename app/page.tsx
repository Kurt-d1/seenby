"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchResult {
  place_id: string
  name: string
  address: string
  rating?: number
  review_count?: number
  category?: string
}

export default function HomePage() {
  var router = useRouter()
  var [searchQuery, setSearchQuery] = useState("")
  var [location, setLocation] = useState("Malta")
  var [results, setResults] = useState<SearchResult[]>([])
  var [loading, setLoading] = useState(false)
  var [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      var response = await fetch("/api/search?query=" + encodeURIComponent(searchQuery) + "&location=" + encodeURIComponent(location))
      var data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleSelectBusiness(placeId: string) {
    router.push("/audit/" + placeId)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">New Business Audit</h1>
          <p className="text-slate-500">Search for a business to analyze its online visibility</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Vecchia Napoli, Day One Advisory..."
                  value={searchQuery}
                  onChange={function(e) { setSearchQuery(e.target.value) }}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Malta, Sliema..."
                  value={location}
                  onChange={function(e) { setLocation(e.target.value) }}
                  className="h-12"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? "Searching..." : "🔍 Search Business"}
            </Button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {loading ? "Searching..." : results.length > 0 ? "Select Your Business" : "No Results Found"}
            </h2>

            {!loading && results.length > 0 && (
              <div className="space-y-3">
                {results.map(function(result) {
                  return (
                    <div
                      key={result.place_id}
                      onClick={function() { handleSelectBusiness(result.place_id) }}
                      className="border border-slate-100 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{result.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">{result.address}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {result.rating && (
                              <span className="text-sm text-yellow-600">
                                ⭐ {result.rating}
                              </span>
                            )}
                            {result.review_count !== undefined && (
                              <span className="text-sm text-slate-400">
                                {result.review_count} reviews
                              </span>
                            )}
                            {result.category && (
                              <span className="text-sm text-slate-400">
                                {result.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button size="sm">
                            Analyze →
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!loading && results.length === 0 && searched && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-slate-500">No businesses found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {!searched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-slate-800 mb-2">Google Presence</h3>
              <p className="text-sm text-slate-500">Check your Google Business profile, reviews, and local rankings</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-slate-800 mb-2">Social Media</h3>
              <p className="text-sm text-slate-500">Analyze Facebook and Instagram presence, engagement, and ads</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-slate-800 mb-2">Competition</h3>
              <p className="text-sm text-slate-500">Compare your visibility against local competitors</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}