'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { IProduct } from '@/models/Product'
import { getProductDisplayImage, getProductDisplayPrice, getWholesaleInfo } from '@/lib/product-utils'

export default function FlashDealsSection() {
  const [timeLeft, setTimeLeft] = useState(3600)
  const [deals, setDeals] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchFlashDeals()
  }, [])

  const fetchFlashDeals = async () => {
    try {
      const response = await fetch('/api/products?flashDeals=true&limit=4')
      if (response.ok) {
        const data = await response.json()
        setDeals(data.products)
      }
    } catch (error) {
      console.error('Error fetching flash deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  return (
    <section className="py-8 md:py-12 px-4 md:px-8 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Today's Natural Deals
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-card rounded-lg p-3">
            <span className="text-sm font-semibold text-muted-foreground">Ends in:</span>
            <div className="flex gap-2">
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold text-sm">
                {String(hours).padStart(2, '0')}h
              </span>
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold text-sm">
                {String(minutes).padStart(2, '0')}m
              </span>
              <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold text-sm">
                {String(seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="bg-muted h-48" />
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2 w-full" />
                  <div className="h-4 bg-muted rounded mb-4 w-24" />
                  <div className="h-8 bg-muted rounded w-full" />
                </div>
              </div>
            ))
          ) : (
            deals.map((deal) => {
              const displayImage = getProductDisplayImage(deal)
              const { price, oldPrice } = getProductDisplayPrice(deal)
              
              // Check if product has wholesale pricing
              const hasWholesale = deal.hasVariants 
                ? deal.variants?.some(v => v.wholesalePrice && v.wholesaleThreshold)
                : !!(deal.wholesalePrice && deal.wholesaleThreshold)
              
              return (
                <div key={deal._id} className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition">
                  <Link href={`/product/${deal._id}`}>
                    <div className="relative pb-full overflow-hidden bg-muted cursor-pointer">
                      <img
                        src={displayImage}
                        alt={deal.name}
                        className="w-full h-48 object-cover hover:scale-105 transition"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-bold">
                          -{deal.flashDealDiscount}%
                        </div>
                        {hasWholesale && (
                          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Bulk Available
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/product/${deal._id}`}>
                      <h3 className="font-semibold text-sm md:text-base text-card-foreground hover:text-primary transition-colors mb-2 line-clamp-2 cursor-pointer">
                        {deal.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-base md:text-lg font-bold text-primary">
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
