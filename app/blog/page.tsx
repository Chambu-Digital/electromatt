import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'
import { IBlogPost } from '@/models/BlogPost'
import { getBlogPosts } from '@/lib/blog-service'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Natural Health Blog | Educational Content on Natural Remedies',
  description: 'Discover the power of natural remedies through our educational blog. Learn about herbs, natural skincare, digestive health, and holistic wellness approaches.',
  keywords: 'natural remedies, herbal medicine, natural health, wellness blog, holistic health'
}

async function fetchBlogPosts() {
  try {
    const data = await getBlogPosts({ published: true })
    return data.posts || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts: IBlogPost[] = await fetchBlogPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Natural Health Blog</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Discover the power of natural remedies and learn how to enhance your wellness journey 
              with time-tested herbal solutions and holistic health approaches.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              We're working on creating valuable content about natural remedies and wellness. 
              Check back soon for educational articles and health tips!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {post.featuredImage && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={post.publishedAt?.toString()}>
                        {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                        }
                      </time>
                      {post.author && (
                        <>
                          <span className="mx-2">•</span>
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
                      {post.title}
                    </h2>

                    {post.subtitle && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{post.subtitle}</p>
                    )}

                    <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>

                    {post.categories.length > 0 && (
                      <div className="flex items-center mb-4">
                        <Tag className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="flex flex-wrap gap-2">
                          {post.categories.slice(0, 3).map((category) => (
                            <span
                              key={category}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {category}
                            </span>
                          ))}
                          {post.categories.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{post.categories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Categories Filter - Future Enhancement */}
        {posts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Explore topics: Natural Remedies • Herbal Medicine • Wellness Tips • Holistic Health
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}