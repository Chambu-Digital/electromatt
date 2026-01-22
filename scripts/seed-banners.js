const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema)

const defaultBanners = [
  {
    title: 'Natural Skincare',
    subtitle: 'Discover Pure, Organic Beauty Solutions',
    image: '/natural-skincare-botanical-ingredients.jpg',
    isActive: true,
    order: 1
  },
  {
    title: 'Essential Oils Collection',
    subtitle: 'Therapeutic Aromatherapy for Your Wellness',
    image: '/essential-oils-bottles-herbs.jpg',
    isActive: true,
    order: 2
  },
  {
    title: 'Herbal Remedies',
    subtitle: 'Ancient Wisdom Meets Modern Wellness',
    image: '/herbal-remedies-natural-medicine.jpg',
    isActive: true,
    order: 3
  }
]

async function seedBanners() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing banners
    await Banner.deleteMany({})
    console.log('Cleared existing banners')

    // Insert default banners
    await Banner.insertMany(defaultBanners)
    console.log('Default banners seeded successfully')

    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  } catch (error) {
    console.error('Error seeding banners:', error)
    process.exit(1)
  }
}

seedBanners()