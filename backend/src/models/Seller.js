import mongoose from 'mongoose'
import { SELLER_STATUSES } from '../constants/statuses.js'

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  province: String,
  district: String,
  ward: String,
  detail: String,
  fullAddress: String
}, { _id: false })

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  shopName: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  description: { type: String, default: '' },
  pickupAddress: addressSchema,
  identityInfo: {
    type: { type: String, enum: ['cccd', 'cmnd', 'passport'] },
    number: String,
    fullName: String,
    frontImage: String,
    backImage: String
  },
  taxInfo: {
    taxCode: String,
    businessType: String,
    companyName: String,
    address: String
  },
  legalAccepted: { type: Boolean, default: false },
  status: { type: String, enum: SELLER_STATUSES, default: 'pending_approval' },
  rejectReason: { type: String, default: '' },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ratingAverage: { type: Number, default: 0 },
  totalProducts: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 }
}, { timestamps: true })

sellerSchema.index({ status: 1 })

export default mongoose.model('Seller', sellerSchema)
