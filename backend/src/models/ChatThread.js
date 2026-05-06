import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['customer', 'seller'], required: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  readAt: { type: Date, default: null },
}, { timestamps: true })

const chatThreadSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  messages: [messageSchema],
  lastMessageAt: { type: Date, default: Date.now },
  lastMessage: { type: String, default: '' },
}, { timestamps: true })

chatThreadSchema.index({ customer: 1, seller: 1 }, { unique: true })
chatThreadSchema.index({ seller: 1, lastMessageAt: -1 })
chatThreadSchema.index({ customer: 1, lastMessageAt: -1 })

export default mongoose.model('ChatThread', chatThreadSchema)
