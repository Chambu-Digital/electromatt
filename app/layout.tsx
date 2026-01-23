import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import GoogleOAuthProvider from '@/components/providers/google-oauth-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ELECTROMATT - Premium Electronics & Appliances',
  description: 'Your trusted electronics store for fridges, microwaves, TVs, smartphones, and all electronic appliances. Quality products with excellent service.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/electromatt-logo.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/electromatt-logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased leading-relaxed`}>
        <GoogleOAuthProvider>
          {children}
        </GoogleOAuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
