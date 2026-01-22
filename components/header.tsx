'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, User, Search, Menu, Leaf, X, ChevronDown, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ICategory } from '@/models/Category'
import { getProductDisplayImage, getProductDisplayPrice } from '@/lib/product-utils'
import { useCartStore } from '@/lib/cart-store'
import { useUserStore } from '@/lib/user-store'

export default function Header() {
  const { getTotalItems, isLoaded } = useCartStore()
  const { user, checkAuth, isLoaded: userLoaded } = useUserStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
    if (!userLoaded) {
      checkAuth()
    }
  }, [checkAuth, userLoaded])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(false)
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value)
    
    if (value.trim().length < 2) {
      setShowSearchResults(false)
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(value.trim())}&catalog=true&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.products || [])
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const selectSearchResult = (product: any) => {
    setShowSearchResults(false)
    setSearchQuery('')
    window.location.href = `/product/${product._id}`
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      {/* Contact Bar */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center md:justify-between text-sm text-muted-foreground">
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:+254702113628" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +254 702 113 628
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Agro House, Moi Avenue, 1st Floor Rm 35
              </div>
            </div>
            {/* Mobile - show only phone */}
            <div className="md:hidden">
              <a href="tel:+254702113628" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +254 702 113 628
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Serenleaf Naturals</h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-1"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </Button>
            
              {showCategories && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/blog">
              <Button variant="ghost">
                Blog
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-8 relative">
            <form onSubmit={handleSearch} className="flex items-center bg-muted rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="flex-1 bg-transparent ml-3 outline-none text-foreground placeholder:text-muted-foreground"
              />
              {searchLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </form>

            {/* Live Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                {searchResults.map((product) => {
                  const displayImage = getProductDisplayImage(product)
                  const { price } = getProductDisplayPrice(product)
                  
                  return (
                    <div
                      key={product._id}
                      onClick={() => selectSearchResult(product)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">KSH {price}</p>
                    </div>
                  )
                })}
                
                {searchQuery.trim() && (
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => handleSearch({ preventDefault: () => {} } as any)}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {user ? (
              <Link href="/account">
                <Button variant="ghost" size="icon" className="relative">
                  <User className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-2 h-2"></span>
                </Button>
              </Link>
            ) : (
              <Link href="/account/login">
                <Button variant="ghost" size="icon">
                  <User className="w-6 h-6" />
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-6 h-6" />
                {isLoaded && getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-primary">Serenleaf Naturals</h1>
          </Link>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {isLoaded && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-4 border-t border-border">
            <div className="relative mt-4">
              <form onSubmit={handleSearch} className="flex items-center bg-muted rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 bg-transparent ml-3 outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                {searchLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                )}
              </form>

              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((product) => {
                    const displayImage = getProductDisplayImage(product)
                    const { price } = getProductDisplayPrice(product)
                    
                    return (
                      <div
                        key={product._id}
                        onClick={() => selectSearchResult(product)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <p className="text-sm font-bold text-primary">KSH {price}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-2 mt-4">
              {user ? (
                <Link href="/account">
                  <Button variant="ghost" className="justify-start w-full">
                    <User className="w-4 h-4 mr-2" /> My Account
                  </Button>
                </Link>
              ) : (
                <Link href="/account/login">
                  <Button variant="ghost" className="justify-start w-full">
                    <User className="w-4 h-4 mr-2" /> Sign In
                  </Button>
                </Link>
              )}
              
              <Link href="/blog">
                <Button variant="ghost" className="justify-start w-full">
                  Blog
                </Button>
              </Link>
              
              {/* Mobile Categories */}
              <div className="border-t pt-2 mt-2">
                <p className="text-sm font-semibold text-gray-600 px-4 py-2">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
