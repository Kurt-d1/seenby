import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { place_id, name, address, phone, website, category, latitude, longitude } = body

    // First, check if business exists or create it
    let { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('google_place_id', place_id)
      .single()

    if (!business) {
      // Create the business
      const { data: newBusiness, error: createError } = await supabase
        .from('businesses')
        .insert({
          google_place_id: place_id,
          name,
          address,
          phone,
          website,
          category,
          latitude,
          longitude
        })
        .select('id')
        .single()

      if (createError) {
        console.error('Error creating business:', createError)
        return NextResponse.json({ error: 'Failed to create business' }, { status: 500 })
      }

      business = newBusiness
    }

    // Create the audit
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .insert({
        business_id: business.id,
        status: 'pending'
      })
      .select('id')
      .single()

    if (auditError) {
      console.error('Error creating audit:', auditError)
      return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 })
    }

    return NextResponse.json({ 
      audit_id: audit.id,
      business_id: business.id 
    })

  } catch (error) {
    console.error('Audit creation error:', error)
    return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 })
  }
}