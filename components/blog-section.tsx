'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IBlogPost } from '@/models/BlogPost'

export default function BlogSection() {
  const [posts, setPosts] = useState<IBlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog?published=true&limit=3')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-8 md:py-12 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground text-balance">
            Wellness Tips & Natural Remedies
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="py-8 md:py-12 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground text-balance">
            Wellness Tips & Natural Remedies
          </h2>
          <p className="text-muted-foreground mb-6">
            We're working on creating valuable content about natural remedies and wellness. 
            Check back soon for educational articles and health tips!
          </p>
          <Link href="/blog">
            <Button>Explore Our Blog</Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 px-4 md:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
            Wellness Tips & Natural Remedies
          </h2>
          <Link href="/blog">
            <Button variant="outline">
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`}>
              <div className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col cursor-pointer">
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={post.featuredImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()
                    }
                  </div>

                  <h3 className="text-lg font-semibold text-card-foreground mb-3 line-clamp-2 hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="w-full justify-start text-primary hover:text-accent p-0 flex items-center font-medium">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
