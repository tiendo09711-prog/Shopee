import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { ROLE_VALUES } from '../constants/roles.js'
import { USER_STATUSES } from '../constants/statuses.js'

const addressSchema = new mongoose.Schema({
  fullName: { type: String, trim: true },
  phone: { type: String, trim: true },
  province: { type: String, trim: true },
  district: { type: String, trim: true },
  ward: { type: String, trim: true },
  detail: { type: String, trim: true },
  fullAddress: { type: String, trim: true },
  isDefault: { type: Boolean, default: false }
})

const refreshTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true },
  userAgent: String,
  ip: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ROLE_VALUES, required: true },
  avatar: { type: String, default: '' },
  addresses: [addressSchema],
  status: { type: String, enum: USER_STATUSES, default: 'active' },
  failedLoginCount: { type: Number, default: 0 },
  lockedReason: { type: String, default: '' },
  lastLoginAt: Date,
  refreshTokens: { type: [refreshTokenSchema], select: false, default: [] }
}, { timestamps: true })

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  return next()
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password
    delete ret.refreshTokens
    return ret
  }
})

export default mongoose.model('User', userSchema)
