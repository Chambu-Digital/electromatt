import { NextRequest, NextResponse } from 'next/server'
import { ensureDBConnection } from '@/lib/db-utils'
import Area from '@/models/Area'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDBConnection()
    
    const { id } = await params
    
    const areas = await Area.find({ 
      countyId: new mongoose.Types.ObjectId(id),
      isActive: true 
    })
      .select('_id name shippingFee estimatedDeliveryDays')
      .sort({ name: 1 })
      .lean()
    
    return NextResponse.json({
      areas
    })
    
  } catch (error) {
    console.error('Error fetching areas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch areas' },
      { status: 500 }
    )
  }
}