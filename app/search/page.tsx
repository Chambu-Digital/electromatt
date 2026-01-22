'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { IProduct } from '@/models/Product'
import { getProductDisplayImage, getProductDisplayPrice } from '@/lib/product-utils'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      fetchSearchResults()
    }
  }, [query])

  const fetchSearchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&catalog=true`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        {query ? `Results for "${query}"` : 'Enter a search term'}
      </p>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="bg-muted h-48" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => {
              const displayImage = getProductDisplayImage(product)
              const { price, oldPrice } = getProductDisplayPrice(product)
              
              return (
                <div key={product._id} className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition">
                  <Link href={`/product/${product._id}`}>
                    <div className="relative bg-muted overflow-hidden h-48 cursor-pointer">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <span className="text-xs text-muted-foreground mb-1 block">{product.category}</span>
                    <Link href={`/product/${product._id}`}>
                      <h3 className="font-semibold text-sm md:text-base text-card-foreground hover:text-primary transition-colors mb-2 line-clamp-2 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-base font-bold text-primary">KSH {price}</span>
                      {oldPrice && (
                        <span className="text-sm line-through text-muted-foreground">KSH {oldPrice}</span>
                      )}
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              {query ? 'No products found matching your search' : 'Enter a search term to find products'}
            </p>
            <Link href="/">
              <Button variant="outline">Browse All Products</Button>
            </Link>
          </div>
        )}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Suspense fallback={
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground mb-8">Loading...</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="bg-card rounded-lg overflow-hidden animate-pulse">
                  <div className="bg-muted h-48" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}