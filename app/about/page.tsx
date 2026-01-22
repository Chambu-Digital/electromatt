'use client'

import { Leaf, Award, Heart, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Natural & Organic',
      description: 'We source only the finest natural ingredients, free from harmful chemicals and synthetic additives.',
    },
    {
      icon: Heart,
      title: 'Wellness Focused',
      description: 'Our mission is to promote holistic health and well-being through nature-inspired products.',
    },
    {
      icon: Globe,
      title: 'Sustainable',
      description: 'We are committed to eco-friendly practices and sustainable sourcing of all our ingredients.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Every product undergoes rigorous testing to ensure purity, potency, and safety.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={0} />

      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 md:px-8 bg-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              About Serenleaf Natural
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              Discover the story behind our natural wellness journey and our commitment to bringing you the purest organic products.
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">Our Story</h2>
            <div className="space-y-6 text-card-foreground leading-relaxed">
              <p>
                Serenleaf Natural was born from a simple belief: that nature holds the key to true wellness. Founded in 2018, our journey began when our founder discovered the transformative power of natural, organic ingredients while searching for solutions to personal health challenges.
              </p>
              <p>
                What started as a personal passion quickly evolved into a mission to share these discoveries with others. We began researching ancient herbal traditions, studying botanical remedies, and connecting with organic farmers who shared our vision for sustainable, chemical-free products.
              </p>
              <p>
                Today, Serenleaf Natural is trusted by thousands of customers across East Africa who have made us part of their daily wellness routine. We remain committed to our core values: authenticity, quality, sustainability, and a genuine care for our customers' well-being.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center text-balance">
              Our Core Values
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-card rounded-lg p-6 border border-border">
                    <Icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team & CTA */}
        <section className="py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">
              Join Our Wellness Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Be part of a movement toward natural, sustainable wellness. Discover products that care for you and the planet.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Shop Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
