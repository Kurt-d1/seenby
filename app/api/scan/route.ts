import { NextRequest, NextResponse } from 'next/server'
import { scanAllDirectories, calculateHealthScore } from '@/lib/directories'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { place_id, business_name, location } = body

    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Run all directory scans
    const results = await scanAllDirectories(
      place_id,
      business_name,
      location,
      apiKey
    )

    // Calculate score
    const score = calculateHealthScore(results)

    return NextResponse.json({
      results,
      score
    })

  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}