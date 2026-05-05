import mongoose from 'mongoose'
import { REFUND_STATUSES } from '../constants/statuses.js'

const refundSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  reason: { type: String, required: true },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  amount: { type: Number, default: 0 },
  status: { type: String, enum: REFUND_STATUSES, default: 'requested' },
  adminNote: { type: String, default: '' },
  sellerNote: { type: String, default: '' },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  handledAt: Date
}, { timestamps: true })

refundSchema.index({ order: 1 })
refundSchema.index({ customer: 1 })
refundSchema.index({ seller: 1 })
refundSchema.index({ status: 1 })

export default mongoose.model('Refund', refundSchema)
