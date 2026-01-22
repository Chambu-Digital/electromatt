'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Users, MessageSquare, TrendingUp } from 'lucide-react'

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  recentReviews: Array<{
    _id: string
    rating: number
    title: string
    comment: string
    createdAt: string
    productId: {
      _id: string
      name: string
      images: string[]
    }
    userId: {
      _id: string
      firstName: string
      lastName: string
    }
  }>
}

export default function ReviewStatsSection() {
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/reviews/public-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching review stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-200 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 bg-muted animate-pulse rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-muted animate-pulse rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-16 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Serenleaf Natural for their wellness journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Reviews */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.totalReviews.toLocaleString()}+
              </div>
              <p className="text-muted-foreground">Customer Reviews</p>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex">{renderStars(stats.averageRating, 'lg')}</div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <p className="text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>

          {/* Happy Customers */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {Math.floor(stats.totalReviews * 0.8).toLocaleString()}+
              </div>
              <p className="text-muted-foreground">Happy Customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews Preview */}
        {stats.recentReviews.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">Recent Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentReviews.slice(0, 3).map((review) => (
                <Card key={review._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {review.userId.firstName.charAt(0)}{review.userId.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {review.userId.firstName} {review.userId.lastName.charAt(0)}.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.productId.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}