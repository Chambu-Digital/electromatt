'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, RefreshCw, Copy, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/custom-toast'

export default function GoogleFeedPage() {
  const [loading, setLoading] = useState(false)
  const [feedStats, setFeedStats] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const feedUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://electromatt.co.ke'}/google-feed.xml`

  const fetchFeedStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/google-feed')
      const text = await response.text()
      
      // Parse XML to count products
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, 'text/xml')
      const items = xmlDoc.getElementsByTagName('item')
      
      setFeedStats({
        totalProducts: items.length,
        lastUpdated: new Date().toLocaleString(),
        feedSize: `${(text.length / 1024).toFixed(2)} KB`
      })
      
      toast.success('Feed stats updated')
    } catch (error) {
      console.error('Error fetching feed:', error)
      toast.error('Failed to fetch feed stats')
    } finally {
      setLoading(false)
    }
  }

  const copyFeedUrl = () => {
    navigator.clipboard.writeText(feedUrl)
    setCopied(true)
    toast.success('Feed URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Google Merchant Center Feed</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your Google Shopping product feed
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feed URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={feedUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <Button
              onClick={copyFeedUrl}
              variant="outline"
              className="gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={() => window.open(feedUrl, '_blank')}
              variant="outline"
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>How to use:</strong> Copy this URL and add it to your Google Merchant Center account 
              under Products → Feeds → Add Feed. The feed updates automatically when products are added or modified.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Feed Statistics</span>
            <Button
              onClick={fetchFeedStats}
              disabled={loading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {feedStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{feedStats.totalProducts}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Feed Size</p>
                <p className="text-2xl font-bold text-gray-900">{feedStats.feedSize}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Last Checked</p>
                <p className="text-sm font-semibold text-gray-900">{feedStats.lastUpdated}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Click refresh to load feed statistics</p>
              <Button onClick={fetchFeedStats} disabled={loading}>
                {loading ? 'Loading...' : 'Load Stats'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feed Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What's Included:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>All active products from your database</li>
              <li>Product variants as separate items (when applicable)</li>
              <li>Product images, prices, and availability</li>
              <li>Automatic updates when products change</li>
              <li>Proper XML escaping for special characters</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Google Merchant Fields:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>id:</strong> Unique product identifier</li>
              <li><strong>title:</strong> Product name</li>
              <li><strong>description:</strong> Product description</li>
              <li><strong>link:</strong> Product page URL</li>
              <li><strong>image_link:</strong> Main product image</li>
              <li><strong>price:</strong> Product price in KES</li>
              <li><strong>availability:</strong> Stock status</li>
              <li><strong>brand:</strong> ELECTROMATT</li>
              <li><strong>condition:</strong> new</li>
              <li><strong>product_type:</strong> Product category</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> The feed is cached for 1 hour for performance. 
              Changes to products may take up to 1 hour to appear in the feed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
