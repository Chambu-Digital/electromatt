'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { IProduct } from '@/models/Product'
import { getProductDisplayImage, getProductDisplayPrice, getWholesaleInfo } from '@/lib/product-utils'

export default function ProductGrid() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground text-balance">
          Popular & Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading skeleton
            Array(8).fill(0).map((_, index) => (
              <div
                key={index}
                className="bg-card rounded-lg overflow-hidden animate-pulse flex flex-col"
              >
                <div className="bg-muted h-48" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="h-3 bg-muted rounded mb-1 w-16" />
                  <div className="h-4 bg-muted rounded mb-2 w-full" />
                  <div className="h-3 bg-muted rounded mb-3 w-20" />
                  <div className="h-4 bg-muted rounded mb-4 w-24" />
                  <div className="h-8 bg-muted rounded w-full mt-auto" />
                </div>
              </div>
            ))
          ) : (
            products.map((product) => {
              const displayImage = getProductDisplayImage(product)
              const { price, oldPrice } = getProductDisplayPrice(product)
              
              // Check if product has wholesale pricing
              const hasWholesale = product.hasVariants 
                ? product.variants?.some(v => v.wholesalePrice && v.wholesaleThreshold)
                : !!(product.wholesalePrice && product.wholesaleThreshold)
              
              return (
                <div
                  key={product._id}
                  className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col"
                >
                  <Link href={`/product/${product._id}`}>
                    <div className="relative bg-muted overflow-hidden h-48 cursor-pointer">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                      {hasWholesale && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Bulk Available
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">{product.category}</span>

                    <Link href={`/product/${product._id}`}>
                      <h3 className="font-semibold text-sm md:text-base text-card-foreground hover:text-primary transition-colors mb-2 line-clamp-2 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? 'fill-secondary text-secondary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-base font-bold text-primary">
                        KSH {price}
                      </span>
                      {oldPrice && (
                        <span className="text-sm line-through text-muted-foreground">
                          KSH {oldPrice}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
