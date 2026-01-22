'use client'

import { useState, useEffect } from 'react'
import { Star, MessageCircle } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ReviewStatsSection from '@/components/review-stats-section'

interface Testimonial {
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
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/reviews/public-stats')
      if (response.ok) {
        const data = await response.json()
        // Use recent reviews as testimonials
        setTestimonials(data.recentReviews || [])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 md:px-8 bg-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Customer Testimonials
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              See what our happy customers have to say about Electromatt products and service.
            </p>
          </div>
        </section>

        {/* Review Stats Section */}
        <ReviewStatsSection />

        {/* Testimonials Grid */}
        <section className="py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Customer Reviews</h2>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-lg p-6 border border-border">
                    <div className="animate-pulse">
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <div key={j} className="w-5 h-5 bg-muted rounded"></div>
                        ))}
                      </div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-6"></div>
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div>
                          <div className="h-4 bg-muted rounded mb-1 w-24"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No reviews available yet.</p>
                <p className="text-sm text-muted-foreground">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition flex flex-col"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonial.rating
                                ? 'fill-secondary text-secondary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                    </div>

                    {/* Testimonial Text */}
                    <h4 className="font-semibold mb-2">{testimonial.title}</h4>
                    <p className="text-card-foreground mb-6 flex-1 leading-relaxed">
                      "{testimonial.comment}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {testimonial.userId.firstName.charAt(0)}{testimonial.userId.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {testimonial.userId.firstName} {testimonial.userId.lastName.charAt(0)}.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Verified Purchase - {testimonial.productId.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
              Share Your Experience
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Have you purchased from Electromatt? We would love to hear about your experience!
            </p>
            <button className="text-primary hover:text-accent font-semibold flex items-center justify-center gap-2 mx-auto">
              <MessageCircle className="w-5 h-5" />
              Send us your testimonial
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
