"use client"

import { useState } from "react"
import { Button } from "./button"

interface Competitor {
  place_id: string
  name: string
  address: string
  rating: number | null
  review_count: number
  category: string
}

interface Stats {
  total_found: number
  average_rating: string | null
  average_reviews: number
  highest_rated: { name: string; rating: number } | null
  most_reviews: { name: string; review_count: number } | null
}

interface CompetitorSelectorProps {
  competitors: Competitor[]
  stats: Stats
  searchQuery: string
  onAnalyze: (selected: Competitor[]) => void
  onCancel: () => void
  loading?: boolean
}

export function CompetitorSelector({
  competitors,
  stats,
  searchQuery,
  onAnalyze,
  onCancel,
  loading
}: CompetitorSelectorProps) {
  var [selected, setSelected] = useState<Set<string>>(new Set())
  var maxSelection = 10

  function toggleSelection(placeId: string) {
    var newSelected = new Set(selected)
    if (newSelected.has(placeId)) {
      newSelected.delete(placeId)
    } else if (newSelected.size < maxSelection) {
      newSelected.add(placeId)
    }
    setSelected(newSelected)
  }

  function selectTopByRating() {
    var sorted = [...competitors]
      .filter(function(c) { return c.rating !== null })
      .sort(function(a, b) { return (b.rating || 0) - (a.rating || 0) })
      .slice(0, 5)
    setSelected(new Set(sorted.map(function(c) { return c.place_id })))
  }

  function selectTopByReviews() {
    var sorted = [...competitors]
      .sort(function(a, b) { return b.review_count - a.review_count })
      .slice(0, 5)
    setSelected(new Set(sorted.map(function(c) { return c.place_id })))
  }

  function handleAnalyze() {
    var selectedCompetitors = competitors.filter(function(c) {
      return selected.has(c.place_id)
    })
    onAnalyze(selectedCompetitors)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          Found {stats.total_found} Competitors
        </h2>
        <p className="text-sm text-slate-500">
          Searched for: "{searchQuery}"
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-slate-800">{stats.total_found}</div>
          <div className="text-xs text-slate-500">Found</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-yellow-600">{stats.average_rating || "N/A"}</div>
          <div className="text-xs text-slate-500">Avg Rating</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-slate-800">{stats.average_reviews}</div>
          <div className="text-xs text-slate-500">Avg Reviews</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-indigo-600">{selected.size}</div>
          <div className="text-xs text-slate-500">Selected</div>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={selectTopByRating}>
          Select Top 5 by Rating
        </Button>
        <Button variant="outline" size="sm" onClick={selectTopByReviews}>
          Select Top 5 by Reviews
        </Button>
        <Button variant="outline" size="sm" onClick={function() { setSelected(new Set()) }}>
          Clear All
        </Button>
      </div>

      {/* Competitor List */}
      <div className="max-h-80 overflow-y-auto space-y-2 mb-6">
        {competitors.map(function(competitor) {
          var isSelected = selected.has(competitor.place_id)
          return (
            <div
              key={competitor.place_id}
              onClick={function() { toggleSelection(competitor.place_id) }}
              className={
                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all " +
                (isSelected
                  ? "bg-indigo-50 border-2 border-indigo-300"
                  : "bg-slate-50 border-2 border-transparent hover:border-slate-200")
              }
            >
              {/* Checkbox */}
              <div className={
                "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 " +
                (isSelected ? "bg-indigo-500 text-white" : "bg-white border border-slate-300")
              }>
                {isSelected && <span className="text-xs">✓</span>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">{competitor.name}</div>
                <div className="text-xs text-slate-500 truncate">{competitor.address}</div>
              </div>

              {/* Rating */}
              <div className="text-right flex-shrink-0">
                {competitor.rating && (
                  <div className="text-sm font-medium text-yellow-600">
                    ⭐ {competitor.rating.toFixed(1)}
                  </div>
                )}
                <div className="text-xs text-slate-400">
                  {competitor.review_count} reviews
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={handleAnalyze}
          disabled={selected.size === 0 || loading}
        >
          {loading ? "Analyzing..." : "Analyze " + selected.size + " Competitors"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <p className="text-xs text-slate-400 text-center mt-3">
        Select up to {maxSelection} competitors for deep analysis
      </p>
    </div>
  )
}
