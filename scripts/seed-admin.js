const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env' })

// Define User schema directly in the script
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  dateOfBirth: { type: Date },
  addresses: [{
    type: { type: String, required: true, enum: ['shipping', 'billing'] },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    county: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false }
  }],
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['customer', 'admin', 'super_admin'], default: 'customer' },
  permissions: {
    products: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    orders: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      cancel: { type: Boolean, default: false }
    },
    blog: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    customers: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false }
    },
    reports: {
      view: { type: Boolean, default: false },
      export: { type: Boolean, default: false }
    },
    settings: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false }
    },
    locations: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false }
    }
  },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date }
}, { timestamps: true })

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model('User', UserSchema)

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if admin already exists
<<<<<<< HEAD
    const existingAdmin = await User.findOne({ email: 'admin@electromatt.co.ke' })
=======
    const existingAdmin = await User.findOne({ email: 'electromatt@gmail.com' })
>>>>>>> 9e6371980dee674cfc1bbaf9d49dc2ffac5847f7
    
    if (existingAdmin) {
      console.log('Admin user already exists!')
      console.log('Email:', existingAdmin.email)
      console.log('Role:', existingAdmin.role)
      console.log('Active:', existingAdmin.isActive)
      
      // Update to super admin role if not already
      if (existingAdmin.role !== 'super_admin') {
        existingAdmin.role = 'super_admin'
        existingAdmin.isApproved = true
        existingAdmin.approvedAt = new Date()
        await existingAdmin.save()
        console.log('Updated existing user to super admin role')
      }
    } else {
      // Create new admin user
      console.log('Creating admin user...')
      
      const adminUser = new User({
        firstName: 'Electromatt',
<<<<<<< HEAD
        lastName: 'Admin',
        email: 'admin@electromatt.co.ke',
=======
        lastName: 'Super Admin',
        email: 'electromatt@gmail.com',
>>>>>>> 9e6371980dee674cfc1bbaf9d49dc2ffac5847f7
        password: 'admin123', // Will be hashed by the pre-save hook
        phone: '+254702113628',
        role: 'super_admin',
        isActive: true,
        isEmailVerified: true,
        isApproved: true,
        approvedAt: new Date()
      })
      
      await adminUser.save()
      console.log('Admin user created successfully!')
    }

    console.log('\n=== ADMIN USER DETAILS ===')
<<<<<<< HEAD
    const admin = await User.findOne({ email: 'admin@electromatt.co.ke' }).select('-password')
=======
    const admin = await User.findOne({ email: 'electromatt@gmail.com' }).select('-password')
>>>>>>> 9e6371980dee674cfc1bbaf9d49dc2ffac5847f7
    console.log('ID:', admin._id)
    console.log('Name:', admin.firstName, admin.lastName)
    console.log('Email:', admin.email)
    console.log('Phone:', admin.phone)
    console.log('Role:', admin.role)
    console.log('Active:', admin.isActive)
    console.log('Email Verified:', admin.isEmailVerified)
    console.log('Created:', admin.createdAt)
    console.log('==========================')

    console.log('\n✅ Admin seeding completed successfully!')
    console.log('You can now login with:')
<<<<<<< HEAD
    console.log('Email: admin@electromatt.co.ke')
=======
    console.log('Email: electromatt@gmail.com')
>>>>>>> 9e6371980dee674cfc1bbaf9d49dc2ffac5847f7
    console.log('Password: admin123')

  } catch (error) {
    console.error('Error seeding admin:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seeding
seedAdmin()