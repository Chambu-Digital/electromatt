'use client'

import { Zap, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6" />
              <h2 className="text-xl font-bold">Electromatt</h2>
            </div>
            <p className="text-sm opacity-90">
              Your trusted electronics store for quality appliances and gadgets.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-75 hover:opacity-100">Home Appliances</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">Kitchen Electronics</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">Entertainment</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">Mobile & Tablets</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-75 hover:opacity-100">Contact Us</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">Shipping Info</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">Returns</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">FAQ</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-75 hover:opacity-100">Privacy Policy</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">Terms of Service</a></li>
              <li><a href="#" className="opacity-75 hover:opacity-100">About Us</a></li>
            </ul>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-3 text-sm">
            <a href="tel:+254702113628" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
              <Phone className="w-4 h-4" />
              <span>+254 702 113 628</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Agro House, Moi Avenue, 1st Floor Rm 35</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@electromatt.co.ke</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">Follow Us</span>
            <Button
              size="icon"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Instagram className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Facebook className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; 2025 Electromatt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
