import mongoose from 'mongoose'

const passwordResetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  otpHash: { type: String, default: '' },
  expiresAt: { type: Date, required: true },
  usedAt: Date,
  requestIp: { type: String, default: '' }
}, { timestamps: true })

passwordResetTokenSchema.index({ user: 1, createdAt: -1 })
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('PasswordResetToken', passwordResetTokenSchema)
