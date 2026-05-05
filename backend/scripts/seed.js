// Run with: node scripts/seed.js
// Creates the default admin user in MongoDB

import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI missing in .env')
  process.exit(1)
}

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  status: { type: String, default: 'active' },
  refreshTokens: [String],
  addresses: [],
  failedLoginCount: { type: Number, default: 0 },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: 'pshop' })
  console.log('Connected to MongoDB: pshop')

  const bcrypt = await import('bcryptjs')

  // Create admin user
  const adminEmail = 'admin@pshop.vn'
  const adminPassword = 'admin123456'
  const existing = await User.findOne({ email: adminEmail })

  if (existing) {
    console.log(`Admin user already exists: ${adminEmail}`)
  } else {
    const hashed = await bcrypt.default.hash(adminPassword, 10)
    await User.create({
      name: 'PShop Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      status: 'active',
    })
    console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`)
  }

  // Create demo seller user
  const sellerEmail = 'seller@pshop.vn'
  const sellerPassword = '123456'
  const existingSeller = await User.findOne({ email: sellerEmail })

  if (existingSeller) {
    console.log(`Seller user already exists: ${sellerEmail}`)
  } else {
    const hashed = await bcrypt.default.hash(sellerPassword, 10)
    await User.create({
      name: 'Demo Seller',
      email: sellerEmail,
      phone: '0123456789',
      password: hashed,
      role: 'seller',
      status: 'active',
    })
    console.log(`✅ Demo seller created: ${sellerEmail} / ${sellerPassword}`)
  }

  // Create demo customer user
  const customerEmail = 'customer@pshop.vn'
  const customerPassword = '123456'
  const existingCustomer = await User.findOne({ email: customerEmail })

  if (existingCustomer) {
    console.log(`Customer user already exists: ${customerEmail}`)
  } else {
    const hashed = await bcrypt.default.hash(customerPassword, 10)
    await User.create({
      name: 'Demo Customer',
      email: customerEmail,
      phone: '0987654321',
      password: hashed,
      role: 'customer',
      status: 'active',
    })
    console.log(`✅ Demo customer created: ${customerEmail} / ${customerPassword}`)
  }

  await mongoose.disconnect()
  console.log('\nSeed hoàn tất!')
  console.log('Tài khoản:')
  console.log('  Admin:    admin@pshop.vn    / admin123456')
  console.log('  Seller:   seller@pshop.vn   / 123456')
  console.log('  Customer: customer@pshop.vn / 123456')
}

seed().catch((err) => { console.error(err); process.exit(1) })
