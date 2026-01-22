import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const period = searchParams.get('period') || '30'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Calculate date range
    let dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    } else {
      const days = parseInt(period)
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - days)
      dateFilter = {
        createdAt: { $gte: fromDate }
      }
    }
    
    if (format === 'csv') {
      const csvData = await generateCSVReport(dateFilter)
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="sales-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }
    
    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
    
  } catch (error: any) {
    console.error('Error exporting report:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    )
  }
}

async function generateCSVReport(dateFilter: any): Promise<string> {
  // Get comprehensive order data
  const orders = await Order.find(dateFilter)
    .populate('userId', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .lean()
  
  // CSV Headers
  const headers = [
    'Order Number',
    'Date',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Status',
    'Payment Status',
    'Payment Method',
    'Subtotal',
    'Shipping Cost',
    'Tax Amount',
    'Discount Amount',
    'Total Amount',
    'Items Count',
    'Product Names',
    'Shipping County',
    'Shipping Area',
    'Tracking Number',
    'Shipped Date',
    'Delivered Date'
  ]
  
  // Convert orders to CSV rows
  const rows = orders.map(order => {
    const customer = order.userId as any
    const productNames = order.items.map(item => item.productName).join('; ')
    
    return [
      order.orderNumber,
      new Date(order.createdAt).toISOString().split('T')[0],
      customer ? `${customer.firstName} ${customer.lastName}` : 'N/A',
      order.customerEmail,
      order.customerPhone || 'N/A',
      order.status,
      order.paymentStatus,
      order.paymentMethod,
      order.subtotal,
      order.shippingCost,
      order.taxAmount,
      order.discountAmount,
      order.totalAmount,
      order.items.length,
      `"${productNames}"`,
      order.shippingAddress.county,
      order.shippingAddress.area,
      order.trackingNumber || 'N/A',
      order.shippedAt ? new Date(order.shippedAt).toISOString().split('T')[0] : 'N/A',
      order.deliveredAt ? new Date(order.deliveredAt).toISOString().split('T')[0] : 'N/A'
    ]
  })
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  return csvContent
}