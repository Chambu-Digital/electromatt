'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, MessageCircle, Package, Clock, Phone } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber)
    } else {
      setLoading(false)
    }
  }, [orderNumber])

  const fetchOrder = async (orderNum: string) => {
    try {
      const response = await fetch(`/api/orders/${orderNum}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Order Sent via WhatsApp!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your order has been recorded and sent to our WhatsApp business line.
          </p>
        </div>

        {orderNumber && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-semibold text-lg">{orderNumber}</span>
              </div>

              {order && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">KSH {order.total?.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-semibold">{order.items?.length} item(s)</span>
                  </div>
                </>
              )}

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-2">WhatsApp Order Confirmation</p>
                    <p className="text-sm text-green-700 mb-2">
                      Your order details have been sent to our WhatsApp business line. 
                      Our team will contact you shortly to confirm your order and arrange delivery.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">+254 713 065 412</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">WhatsApp Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    Our team will respond to your WhatsApp message within a few minutes to confirm your order details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Payment & Delivery Details</p>
                  <p className="text-sm text-muted-foreground">
                    We'll discuss payment options (M-Pesa, Cash on Delivery) and confirm your delivery address.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-muted-foreground">
                    Once payment is confirmed, we'll process your order and arrange delivery to your location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium">Delivery Updates</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive delivery updates via WhatsApp, including tracking information when your order is shipped.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your order reference number is <strong>{orderNumber}</strong>. 
            Please keep this for tracking purposes. You can view your order status in your account dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button asChild className="flex-1">
            <Link href="/account/orders">View My Orders</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Need help with your order?
          </p>
          <Button
            variant="outline"
            onClick={() => window.open('https://wa.me/254713065412', '_blank')}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Us on WhatsApp
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
