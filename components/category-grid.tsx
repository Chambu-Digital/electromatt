'use client'

import { useState, useRef, useEffect } from 'react'
import { Leaf, Droplet, Wind, Flower2, Soup as Soap, Heart, LeafIcon, Gift, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ICategory } from '@/models/Category'

// Icon mapping
const iconMap: { [key: string]: any } = {
  'Flower2': Flower2,
  'Leaf': Leaf,
  'Droplet': Droplet,
  'Wind': Wind,
  'Soap': Soap,
  'Heart': Heart,
  'LeafIcon': LeafIcon,
  'Gift': Gift,
}

export default function CategoryGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      checkScrollButtons()
      const handleResize = () => checkScrollButtons()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [categories])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 200
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2, // Scroll by 2 cards (1 column in 2-row layout)
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 200
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2, // Scroll by 2 cards (1 column in 2-row layout)
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-8 md:py-12 px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground text-balance">
        Shop by Category
      </h2>

      <div className="max-w-6xl mx-auto relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Scrollable Grid Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="grid grid-rows-2 grid-flow-col gap-4 min-w-full w-max">
            {loading ? (
              // Loading skeleton
              Array(8).fill(0).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-muted p-6 text-center flex flex-col items-center justify-center gap-3 w-40 md:w-48 animate-pulse"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-muted-foreground/20 rounded" />
                  <div className="h-4 bg-muted-foreground/20 rounded w-24" />
                </div>
              ))
            ) : (
              categories.map((category) => {
                const Icon = iconMap[category.icon] || Leaf
                return (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="group cursor-pointer rounded-lg bg-card p-6 text-center hover:shadow-md hover:bg-muted transition flex flex-col items-center justify-center gap-3 w-40 md:w-48"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-accent transition" />
                    <p className="font-medium text-sm md:text-base text-card-foreground text-pretty">
                      {category.name}
                    </p>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
