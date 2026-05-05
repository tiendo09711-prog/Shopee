import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDb, disconnectDb } from '../config/db.js'
import AuditLog from '../models/AuditLog.js'
import Cart from '../models/Cart.js'
import Category from '../models/Category.js'
import Notification from '../models/Notification.js'
import Order from '../models/Order.js'
import PasswordResetToken from '../models/PasswordResetToken.js'
import Product from '../models/Product.js'
import Refund from '../models/Refund.js'
import Report from '../models/Report.js'
import Review from '../models/Review.js'
import Seller from '../models/Seller.js'
import User from '../models/User.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, 'data')

const files = {
  users: 'users.json',
  sellers: 'sellers.json',
  categories: 'categories.json',
  products: 'products.json',
  carts: 'carts.json',
  orders: 'orders.json',
  reviews: 'reviews.json',
  refunds: 'refunds.json',
  reports: 'reports.json',
  notifications: 'notifications.json',
  auditLogs: 'auditLogs.json'
}

function fromExtendedJson(value) {
  if (Array.isArray(value)) return value.map(fromExtendedJson)
  if (!value || typeof value !== 'object') return value
  if (value.$oid) return new mongoose.Types.ObjectId(value.$oid)
  if (value.$date) return new Date(value.$date)
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fromExtendedJson(item)]))
}

async function readSeed(name) {
  const raw = await fs.readFile(path.join(dataDir, files[name]), 'utf8')
  return fromExtendedJson(JSON.parse(raw))
}

async function clearCollections() {
  await AuditLog.deleteMany({})
  await Notification.deleteMany({})
  await Report.deleteMany({})
  await Refund.deleteMany({})
  await Review.deleteMany({})
  await Order.deleteMany({})
  await Cart.deleteMany({})
  await Product.deleteMany({})
  await Category.deleteMany({})
  await Seller.deleteMany({})
  await User.deleteMany({})
  await PasswordResetToken.deleteMany({})
}

async function recalculateDerivedData() {
  const categories = await Category.find()
  await Promise.all(categories.map(async (category) => {
    const productsCount = await Product.countDocuments({ category: category._id })
    await Category.updateOne({ _id: category._id }, { productsCount })
  }))

  const sellers = await Seller.find()
  await Promise.all(sellers.map(async (seller) => {
    const products = await Product.find({ seller: seller._id })
    const totalSales = products.reduce((sum, product) => sum + product.sold, 0)
    await Seller.updateOne({ _id: seller._id }, { totalProducts: products.length, totalSales })
  }))

  const products = await Product.find()
  await Promise.all(products.map(async (product) => {
    const reviews = await Review.find({ product: product._id, status: 'visible' })
    const ratingAverage = reviews.length
      ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
      : 0
    await Product.updateOne({ _id: product._id }, { ratingAverage, reviewCount: reviews.length })
  }))
}

async function seed() {
  await connectDb()
  await clearCollections()

  const users = await readSeed('users')
  const hashedUsers = await Promise.all(users.map(async (user) => ({
    ...user,
    password: await bcrypt.hash(user.password, 10)
  })))

  await User.insertMany(hashedUsers)
  await Seller.insertMany(await readSeed('sellers'))
  await Category.insertMany(await readSeed('categories'))
  await Product.insertMany(await readSeed('products'))
  await Cart.insertMany(await readSeed('carts'))
  await Order.insertMany(await readSeed('orders'))
  await Review.insertMany(await readSeed('reviews'))
  await Refund.insertMany(await readSeed('refunds'))
  await Report.insertMany(await readSeed('reports'))
  await Notification.insertMany(await readSeed('notifications'))
  await AuditLog.insertMany(await readSeed('auditLogs'))
  await recalculateDerivedData()

  console.log('Seed completed.')
  console.log('Demo accounts:')
  console.log('Admin: admin@pshop.vn / admin123456')
  console.log('Customer: customer@pshop.vn / customer123456')
  console.log('Seller approved: seller@pshop.vn / seller123456')
  console.log('Seller pending: seller.pending@pshop.vn / seller123456')

  await disconnectDb()
}

seed().catch(async (error) => {
  console.error('Seed failed:', error)
  await disconnectDb()
  process.exit(1)
})
