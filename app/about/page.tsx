'use client'

import { Zap, Award, Shield, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: 'Latest Technology',
      description: 'We offer cutting-edge electronics and appliances with the latest features and innovations.',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'All our products come with manufacturer warranties and our commitment to quality service.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across Kenya with professional installation services available.',
    },
    {
      icon: Award,
      title: 'Expert Support',
      description: 'Our knowledgeable team provides expert advice and after-sales support for all products.',
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
              About Electromatt
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              Your trusted electronics partner in Kenya, providing quality appliances and exceptional service since 2018.
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">Our Story</h2>
            <div className="space-y-6 text-card-foreground leading-relaxed">
              <p>
                Electromatt was founded in 2018 with a vision to make quality electronics accessible to every Kenyan household. What started as a small electronics shop has grown into one of Kenya's most trusted electronics retailers, serving thousands of satisfied customers across the country.
              </p>
              <p>
                Our journey began when our founder recognized the need for reliable, affordable electronics with excellent customer service. We partnered with leading global brands like Samsung, LG, Sony, and others to bring you the latest technology at competitive prices.
              </p>
              <p>
                Today, Electromatt is your one-stop destination for home appliances, kitchen electronics, entertainment systems, and mobile devices. We pride ourselves on our expert advice, professional installation services, and comprehensive after-sales support.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center text-balance">
              Why Choose Electromatt
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
              Why Choose Electromatt?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Experience the difference with Kenya's most trusted electronics retailer. Quality products, expert service, and unbeatable value.
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
