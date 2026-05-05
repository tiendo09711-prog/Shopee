import mongoose from 'mongoose'
import { REVIEW_STATUSES } from '../constants/statuses.js'

const reviewSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  images: { type: [String], default: [] },
  anonymous: { type: Boolean, default: false },
  status: { type: String, enum: REVIEW_STATUSES, default: 'visible' }
}, { timestamps: true })

reviewSchema.index({ order: 1, product: 1, customer: 1 }, { unique: true })
reviewSchema.index({ product: 1 })
reviewSchema.index({ seller: 1 })

export default mongoose.model('Review', reviewSchema)
