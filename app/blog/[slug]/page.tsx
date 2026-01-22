import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { IBlogPost } from '@/models/BlogPost'
import { IProduct } from '@/models/Product'
import { Button } from '@/components/ui/button'
import { getProductDisplayPrice, getProductDisplayImage } from '@/lib/product-utils'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog-service'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: `${post.title} | Natural Health Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords || post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.publishedAt?.toString(),
      authors: post.author ? [post.author] : undefined,
      tags: post.tags
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedBlogPosts(slug, post.categories)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex items-center mb-4">
                <Tag className="h-4 w-4 text-gray-400 mr-2" />
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Title and Subtitle */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            {post.subtitle && (
              <p className="text-xl text-gray-600 mb-6">{post.subtitle}</p>
            )}

            {/* Meta Information */}
            <div className="flex items-center text-sm text-gray-500 mb-8 pb-8 border-b">
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
                  <span className="mx-3">•</span>
                  <User className="h-4 w-4 mr-1" />
                  <span>By {post.author}</span>
                </>
              )}
              <div className="ml-auto">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                className="text-gray-700 leading-relaxed"
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {post.relatedProducts.map((product: any) => {
                  // Handle case where product might not be fully populated
                  if (!product || typeof product === 'string' || !product.name) {
                    return null; // Skip unpopulated products
                  }

                  const displayImage = getProductDisplayImage(product);
                  const { price, oldPrice } = getProductDisplayPrice(product);
                  
                  return (
                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-green-600">
                            KSH {price}
                          </span>
                          {oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              KSH {oldPrice}
                            </span>
                          )}
                        </div>
                        <Link href={`/product/${product._id}`}>
                          <Button size="sm">View Product</Button>
                        </Link>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
              
              {/* Show message if no valid products after filtering */}
              {post.relatedProducts.every((product: any) => !product || typeof product === 'string' || !product.name) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Featured products are currently unavailable.</p>
                  <Link href="/products">
                    <Button className="mt-4">Browse All Products</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {relatedPost.featuredImage && (
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        <Link href={`/blog/${relatedPost.slug}`} className="hover:text-green-600 transition-colors">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                      <div className="mt-3">
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
      
      <Footer />
    </div>
  )
}