import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch audit with results
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: auditId } = await params

  try {
    // Get audit
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single()

    if (auditError || !audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Get business
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', audit.business_id)
      .single()

    // Get directory listings
    const { data: listings } = await supabase
      .from('directory_listings')
      .select('*')
      .eq('audit_id', auditId)

    return NextResponse.json({ audit, business, listings })

  } catch (error) {
    console.error('Fetch audit error:', error)
    return NextResponse.json({ error: 'Failed to fetch audit' }, { status: 500 })
  }
}

// PUT - Update audit with scores and directory results
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: auditId } = await params

  try {
    const body = await request.json()
    const { overall_score, listings_score, status, directories } = body

    // Update audit scores
    const { error: auditError } = await supabase
      .from('audits')
      .update({
        overall_score,
        listings_score,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', auditId)

    if (auditError) {
      console.error('Error updating audit:', auditError)
      return NextResponse.json({ error: 'Failed to update audit' }, { status: 500 })
    }

    // Save directory listings if provided
    if (directories && directories.length > 0) {
      const listingsToInsert = directories.map((dir: any) => ({
        audit_id: auditId,
        directory: dir.directory,
        status: dir.status,
        external_url: dir.external_url || null,
        found_name: dir.found_name || null,
        found_address: dir.found_address || null,
        found_phone: dir.found_phone || null,
        found_rating: dir.found_rating || null,
        found_review_count: dir.found_review_count || null,
        name_match: dir.name_match || null,
        address_match: dir.address_match || null,
        phone_match: dir.phone_match || null
      }))

      const { error: listingsError } = await supabase
        .from('directory_listings')
        .insert(listingsToInsert)

      if (listingsError) {
        console.error('Error saving listings:', listingsError)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Update audit error:', error)
    return NextResponse.json({ error: 'Failed to update audit' }, { status: 500 })
  }
}