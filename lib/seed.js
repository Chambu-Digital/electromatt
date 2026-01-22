const mongoose = require('mongoose')

// MongoDB connection
async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      return
    }
    
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    
    // Clean up the URI to handle potential parsing issues
    const cleanUri = mongoUri.replace('?appName=Serenleaf', '?appName=Serenleaf&retryWrites=true&w=majority')
    
    await mongoose.connect(cleanUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
  icon: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Product Schema
const variantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  wholesalePrice: { type: Number, min: 0 },
  wholesaleThreshold: { type: Number, min: 1 },
  image: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true },
  isActive: { type: Boolean, default: true }
})

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  hasVariants: { type: Boolean, default: false },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  wholesalePrice: { type: Number, min: 0 },
  wholesaleThreshold: { type: Number, min: 1 },
  images: [String],
  variants: [variantSchema],
  category: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0, min: 0 },
  isBestseller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isFlashDeal: { type: Boolean, default: false },
  flashDealDiscount: { type: Number, min: 0, max: 100 },
  isNewProduct: { type: Boolean, default: false },
  ingredients: String,
  usage: String,
  benefits: [String],
  tags: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

const categories = [
  {
    name: 'Skincare & Beauty',
    slug: 'skincare-beauty',
    description: 'Discover our premium collection of natural skincare products designed to nourish and revitalize your skin.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    icon: 'Flower2',
    isActive: true
  },
  {
    name: 'Herbal Remedies',
    slug: 'herbal-remedies',
    description: 'Traditional herbal solutions for modern wellness needs, crafted with time-tested natural ingredients.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
    icon: 'Leaf',
    isActive: true
  },
  {
    name: 'Essential Oils',
    slug: 'essential-oils',
    description: 'Pure, therapeutic-grade essential oils for aromatherapy, wellness, and natural healing.',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800',
    icon: 'Droplet',
    isActive: true
  },
  {
    name: 'Haircare',
    slug: 'haircare',
    description: 'Natural hair care products that nourish and strengthen your hair from root to tip.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    icon: 'Wind',
    isActive: true
  },
  {
    name: 'Soaps & Body Care',
    slug: 'soaps-body-care',
    description: 'Luxurious natural soaps and body care products for healthy, glowing skin.',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800',
    icon: 'Soap',
    isActive: true
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Holistic wellness products to support your overall health and well-being.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    icon: 'Heart',
    isActive: true
  },
  {
    name: 'Organic Ingredients',
    slug: 'organic-ingredients',
    description: 'Pure, organic ingredients for DIY natural products and recipes.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
    icon: 'LeafIcon',
    isActive: true
  },
  {
    name: 'Bundles & Gift Sets',
    slug: 'bundles-gift-sets',
    description: 'Curated gift sets and product bundles perfect for yourself or loved ones.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
    icon: 'Gift',
    isActive: true
  }
]

const products = [
  // Premium Face Serum Collection
  {
    name: 'Premium Face Serum Collection',
    slug: 'premium-face-serum-collection',
    description: 'Our premium face serum collection offers multiple sizes and scents to suit your skincare needs. Each variant is carefully crafted with organic ingredients.',
    hasVariants: true,
    price: 0,
    images: [],
    variants: [
      {
        id: 'variant-serum-15ml-rose',
        type: 'size',
        value: '15ml Rose',
        price: 25.99,
        oldPrice: 35.99,
        wholesalePrice: 20.99,
        wholesaleThreshold: 10,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        stock: 20,
        sku: 'SER-15ML-ROSE',
        isActive: true
      },
      {
        id: 'variant-serum-30ml-rose',
        type: 'size',
        value: '30ml Rose',
        price: 45.99,
        oldPrice: 59.99,
        wholesalePrice: 38.99,
        wholesaleThreshold: 8,
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500',
        stock: 15,
        sku: 'SER-30ML-ROSE',
        isActive: true
      },
      {
        id: 'variant-serum-30ml-lavender',
        type: 'scent',
        value: '30ml Lavender',
        price: 48.99,
        oldPrice: 62.99,
        wholesalePrice: 41.99,
        wholesaleThreshold: 8,
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500',
        stock: 12,
        sku: 'SER-30ML-LAV',
        isActive: true
      }
    ],
    category: 'Skincare & Beauty',
    inStock: true,
    stockQuantity: 47,
    rating: 4.8,
    reviews: 124,
    isBestseller: true,
    isFeatured: true,
    ingredients: 'Rose extract, Lavender oil, Jojoba oil, Vitamin E, Rosehip oil',
    usage: 'Apply 2-3 drops to clean, damp face. Gently massage upward. Use morning and night.',
    benefits: [
      'Deep hydration and moisture retention',
      'Reduces fine lines and wrinkles', 
      'Enhances skin radiance and glow',
      'Anti-inflammatory properties',
      '100% natural and organic ingredients'
    ],
    tags: ['anti-aging', 'hydrating', 'organic', 'variants'],
    isActive: true
  },
  // Chamomile Bath Soak
  {
    name: 'Chamomile Bath Soak',
    slug: 'chamomile-bath-soak',
    description: 'Relaxing chamomile bath soak with dried flowers and essential oils for a spa-like experience at home.',
    hasVariants: true,
    price: 0,
    images: [],
    variants: [
      {
        id: 'variant-chamomile-sachet',
        type: 'size',
        value: 'Single Use Sachet',
        price: 8.99,
        oldPrice: 12.99,
        wholesalePrice: 6.99,
        wholesaleThreshold: 20,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
        stock: 50,
        sku: 'CHAM-SACH-001',
        isActive: true
      },
      {
        id: 'variant-chamomile-200g',
        type: 'size',
        value: '200g Jar',
        price: 22.99,
        oldPrice: 29.99,
        wholesalePrice: 18.99,
        wholesaleThreshold: 12,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
        stock: 30,
        sku: 'CHAM-200G-001',
        isActive: true
      },
      {
        id: 'variant-chamomile-500g',
        type: 'size',
        value: '500g Jar',
        price: 45.99,
        oldPrice: 59.99,
        wholesalePrice: 38.99,
        wholesaleThreshold: 8,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
        stock: 15,
        sku: 'CHAM-500G-001',
        isActive: true
      }
    ],
    category: 'Soaps & Body Care',
    inStock: true,
    stockQuantity: 95,
    rating: 4.6,
    reviews: 87,
    isNewProduct: true,
    ingredients: 'Dried chamomile flowers, Epsom salt, Sea salt, Chamomile essential oil',
    usage: 'Add 2-3 tablespoons to warm bath water. Soak for 15-20 minutes.',
    benefits: ['Soothes tired muscles', 'Calms the mind', 'Softens skin', 'Promotes better sleep'],
    tags: ['chamomile', 'bath', 'relaxing', 'sleep']
  }
]

async function seedDatabase() {
  try {
    await connectDB()
    
    // Clear existing data
    await Category.deleteMany({})
    await Product.deleteMany({})
    
    console.log('Cleared existing data')
    
    // Seed categories
    const createdCategories = await Category.insertMany(categories)
    console.log(`Seeded ${createdCategories.length} categories`)
    
    // Create a map of category names to IDs
    const categoryMap = new Map()
    createdCategories.forEach(cat => {
      categoryMap.set(cat.name, cat._id)
    })
    
    // Add categoryId to products and ensure isActive is true
    const productsWithCategoryId = products.map(product => ({
      ...product,
      categoryId: categoryMap.get(product.category),
      isActive: true
    }))
    
    // Seed products
    const createdProducts = await Product.insertMany(productsWithCategoryId)
    console.log(`Seeded ${createdProducts.length} products`)
    
    console.log('Database seeded successfully!')
    return { success: true, categories: createdCategories.length, products: createdProducts.length || 0 }
    
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

module.exports = { seedDatabase }