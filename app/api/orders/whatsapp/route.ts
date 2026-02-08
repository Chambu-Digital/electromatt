import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      customerName,
      customerPhone,
      customerEmail = 'whatsapp@electromatt.co.ke',
      items,
      shippingAddress,
      customerNotes,
      whatsappMessage
    } = body

    // Validate required fields
    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name and items are required' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )
    const shippingCost = subtotal >= 5000 ? 0 : 500
    const total = subtotal + shippingCost

    // Generate order number
    const orderCount = await Order.countDocuments()
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`

    // Prepare order items with product validation
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item.productId)
        
        return {
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || product?.images?.[0] || '',
          variantId: item.variantId,
          variantDetails: item.variantDetails
        }
      })
    )

    // Create the order
    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '+254713065412',
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress: shippingAddress || {
        county: 'Nairobi',
        area: 'CBD',
        address: 'To be confirmed via WhatsApp'
      },
      paymentMethod: 'pending',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      customerNotes: customerNotes || 'Order placed via WhatsApp',
      adminNotes: `WhatsApp Order - ${new Date().toLocaleString()}\n\nMessage sent:\n${whatsappMessage || 'N/A'}`,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: 'WhatsApp order recorded successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.orderStatus
      }
    })

  } catch (error) {
    console.error('Error creating WhatsApp order:', error)
    return NextResponse.json(
      { error: 'Failed to record WhatsApp order' },
      { status: 500 }
    )
  }
}
