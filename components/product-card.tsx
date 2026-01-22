'use client'

import { useState } from 'react'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
}

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-32 h-32 shrink-0">
            <img
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  New
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                  Bestseller
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-destructive text-white text-xs px-2 py-1 rounded-full font-semibold">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold text-lg text-card-foreground hover:text-primary transition-colors mb-2">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-secondary text-secondary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              {/* Stock Status */}
              <p className={`text-sm font-medium mb-3 ${
                product.inStock ? 'text-green-600' : 'text-destructive'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">
                  KSH {product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-sm line-through text-muted-foreground">
                    KSH {product.oldPrice}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
                </Button>
                <Link href={`/product/${product.id}`}>
                  <Button variant="outline" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  size="sm"
                  disabled={!product.inStock}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-semibold">
              Bestseller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-destructive text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : 'text-gray-600'}`} />
        </button>

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link href={`/product/${product.id}`}>
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Quick View
            </Button>
          </Link>
          <Button 
            size="sm"
            disabled={!product.inStock}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-card-foreground hover:text-primary transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-secondary text-secondary'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary">
            KSH {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-sm line-through text-muted-foreground">
              KSH {product.oldPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-sm font-medium mb-4 ${
          product.inStock ? 'text-green-600' : 'text-destructive'
        }`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Add to Cart Button */}
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  )
}