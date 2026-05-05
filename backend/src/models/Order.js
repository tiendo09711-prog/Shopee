import mongoose from 'mongoose'
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../constants/statuses.js'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  sku: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
  reviewed: { type: Boolean, default: false }
})

const shippingAddressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  province: String,
  district: String,
  ward: String,
  detail: String,
  fullAddress: String
}, { _id: false })

const timelineSchema = new mongoose.Schema({
  status: String,
  label: String,
  note: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedByRole: String,
  changedAt: { type: Date, default: Date.now }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  subtotal: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: PAYMENT_METHODS, default: 'cod' },
  paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'unpaid' },
  status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
  cancelReason: { type: String, default: '' },
  trackingCode: { type: String, default: '' },
  shippingProvider: { type: String, default: '' },
  timeline: [timelineSchema],
  deliveredAt: Date,
  completedAt: Date,
  cancelledAt: Date
}, { timestamps: true })

orderSchema.index({ customer: 1 })
orderSchema.index({ seller: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

export default mongoose.model('Order', orderSchema)
