'use client'

import { useState } from 'react'
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+254 702 113 628',
      link: 'tel:+254702113628',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@electromatt.co.ke',
      link: 'mailto:info@electromatt.co.ke',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Agro House, Moi Avenue, 1st Floor Rm 35',
      link: '#',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: '+254 702 113 628',
      link: 'https://wa.me/254702113628',
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
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Have questions? We would love to hear from you. Contact us anytime!
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    className="bg-card rounded-lg p-6 text-center border border-border hover:shadow-lg transition"
                  >
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-card-foreground mb-2">
                      {info.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{info.details}</p>
                  </a>
                )
              })}
            </div>

            {/* Contact Form & Info */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
                <h2 className="text-2xl font-bold text-card-foreground mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-card-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-card-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-card-foreground">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="What is this about?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-card-foreground">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us what's on your mind..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              </div>

              {/* FAQ or Additional Info */}
              <div>
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border mb-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">
                        What are your delivery options?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We offer free delivery within Nairobi and installation services for major appliances. Countrywide delivery available.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">
                        Do you provide warranties?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, all our products come with manufacturer warranties. We also provide extended warranty options.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-2">
                        Do you offer installation services?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, we provide professional installation services for appliances like fridges, washing machines, and TVs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2">
                    Business Hours
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
