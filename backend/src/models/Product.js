import mongoose from 'mongoose'
import { PRODUCT_STATUSES } from '../constants/statuses.js'

const attributeSchema = new mongoose.Schema({
  name: String,
  value: String
}, { _id: false })

const variantSchema = new mongoose.Schema({
  name: String,
  options: [String]
}, { _id: false })

const priceHistorySchema = new mongoose.Schema({
  price: Number,
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false })

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true, maxLength: 255, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  sku: { type: String, required: true, unique: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0, default: 0 },
  stock: { type: Number, required: true, min: 0 },
  sold: { type: Number, default: 0 },
  images: { type: [String], required: true, validate: [(items) => items.length > 0, 'At least one image is required'] },
  attributes: [attributeSchema],
  variants: [variantSchema],
  status: { type: String, enum: PRODUCT_STATUSES, default: 'draft' },
  rejectReason: { type: String, default: '' },
  ratingAverage: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  priceHistory: [priceHistorySchema]
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', sku: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ seller: 1 })
productSchema.index({ status: 1 })
productSchema.index({ price: 1 })
productSchema.index({ createdAt: -1 })

export default mongoose.model('Product', productSchema)
