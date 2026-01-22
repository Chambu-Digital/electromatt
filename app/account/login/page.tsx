'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf } from 'lucide-react'
import { useUserStore } from '@/lib/user-store'
import GoogleSignInButton from '@/components/auth/google-sign-in-button'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useUserStore()
  const [returnTo, setReturnTo] = useState<string>('/')

  // Get return URL from query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const returnUrl = urlParams.get('returnTo')
    if (returnUrl) {
      setReturnTo(decodeURIComponent(returnUrl))
    }
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(returnTo)
    }
  }, [user, router, returnTo])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <Leaf className="w-6 h-6" />
            Serenleaf
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            <GoogleSignInButton
              onSuccess={() => {
                // Success handled by the component
              }}
              onError={(error) => console.error('Login error:', error)}
            />
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}