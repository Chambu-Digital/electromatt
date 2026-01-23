'use client'

import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img 
                src="/electromatt-logo.svg" 
                alt="Electromatt Logo" 
                className="w-6 h-6"
              />
              <h2 className="text-lg font-black uppercase tracking-wide">ELECTROMATT</h2>
            </div>
            <p className="text-sm opacity-90 mb-4 leading-relaxed">
              Kenya's trusted electronics retailer since 2018. Quality appliances, competitive prices, exceptional service.
            </p>
            <div className="flex items-center gap-2 text-sm opacity-75">
              <Clock className="w-4 h-4" />
              <span>Mon-Fri: 8AM-6PM</span>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Contact Us</h3>
            <div className="space-y-2">
              <a href="tel:+254702113628" className="flex items-center gap-2 text-sm hover:opacity-75 transition-opacity">
                <Phone className="w-4 h-4" />
                <span>+254 702 113 628</span>
              </a>
              <a href="https://wa.me/254702113628" className="flex items-center gap-2 text-sm hover:opacity-75 transition-opacity text-green-600">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a href="mailto:info@electromatt.co.ke" className="flex items-center gap-2 text-sm hover:opacity-75 transition-opacity">
                <Mail className="w-4 h-4" />
                <span>info@electromatt.co.ke</span>
              </a>
              <div className="flex items-start gap-2 text-sm opacity-75">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div>Agro House, Moi Avenue</div>
                  <div>1st Floor, Room 35</div>
                  <div>Nairobi, Kenya</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/products" className="block opacity-75 hover:opacity-100 transition-opacity">
                Products
              </Link>
              <Link href="/categories" className="block opacity-75 hover:opacity-100 transition-opacity">
                Categories
              </Link>
              <Link href="/blog" className="block opacity-75 hover:opacity-100 transition-opacity">
                Tech Blog
              </Link>
              <Link href="/about" className="block opacity-75 hover:opacity-100 transition-opacity">
                About Us
              </Link>
              <Link href="/contact" className="block opacity-75 hover:opacity-100 transition-opacity">
                Contact
              </Link>
              <Link href="/testimonials" className="block opacity-75 hover:opacity-100 transition-opacity">
                Customer Reviews
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Stay Updated</h3>
            <p className="text-sm opacity-75 mb-3 leading-relaxed">
              Subscribe to get the latest deals, tech news, and product updates.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40 focus:bg-primary-foreground/15"
              />
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>&copy; 2026 <span className="font-semibold">Electromatt</span>. All rights reserved.</span>
            {/* <div className="flex items-center gap-4">
              <a href="#" className="opacity-75 hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="opacity-75 hover:opacity-100 transition-opacity">Terms of Service</a>
            </div> */}
          </div>
          <div className="text-xs opacity-60">
            Trusted electronics retailer in Kenya
          </div>
        </div>
      </div>
    </footer>
  )
}
