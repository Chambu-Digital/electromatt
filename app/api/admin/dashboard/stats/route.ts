import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Review from '@/models/Review'
import BlogPost from '@/models/BlogPost'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Check if user has admin permissions
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    await connectDB()
    
    // Get all stats in parallel for better performance
    const [
      // Product stats
      totalProducts,
      activeProducts,
      outOfStockProducts,
      
      // Customer stats
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      
      // Order stats
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      
      // Revenue stats
      totalRevenue,
      monthlyRevenue,
      
      // Review stats
      totalReviews,
      pendingReviews,
      approvedReviews,
      
      // Blog stats
      totalBlogPosts,
      publishedBlogPosts,
      
      // Category stats (from products)
      categories
    ] = await Promise.all([
      // Products
      Product.countDocuments(),
      Product.countDocuments({ inStock: true }),
      Product.countDocuments({ stockQuantity: { $lte: 0 } }),
      
      // Customers
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', isActive: true }),
      User.countDocuments({ 
        role: 'customer', 
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        } 
      }),
      
      // Orders
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      
      // Revenue
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled', 'returned'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            status: { $nin: ['cancelled', 'returned'] },
            createdAt: { 
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
            }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Reviews
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      
      // Blog
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ published: true }),
      
      // Categories (distinct from products)
      Product.distinct('category')
    ])
    
    // Calculate revenue values
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0
    const monthRevenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const [recentOrders, recentCustomers, recentReviews] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ role: 'customer', createdAt: { $gte: sevenDaysAgo } }),
      Review.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ])
    
    return NextResponse.json({
      products: {
        total: totalProducts,
        active: activeProducts,
        outOfStock: outOfStockProducts,
        categories: categories.length
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        newThisMonth: newCustomersThisMonth,
        recentWeek: recentCustomers
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        recentWeek: recentOrders
      },
      revenue: {
        total: revenue,
        thisMonth: monthRevenue,
        averageOrderValue: totalOrders > 0 ? revenue / totalOrders : 0
      },
      reviews: {
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews,
        recentWeek: recentReviews
      },
      blog: {
        total: totalBlogPosts,
        published: publishedBlogPosts,
        draft: totalBlogPosts - publishedBlogPosts
      },
      activity: {
        ordersThisWeek: recentOrders,
        customersThisWeek: recentCustomers,
        reviewsThisWeek: recentReviews
      }
    })
    
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}