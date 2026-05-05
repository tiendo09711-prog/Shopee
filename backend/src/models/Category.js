import mongoose from 'mongoose'
import { CATEGORY_STATUSES } from '../constants/statuses.js'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  status: { type: String, enum: CATEGORY_STATUSES, default: 'active' },
  productsCount: { type: Number, default: 0 },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true })

categorySchema.index({ status: 1 })
categorySchema.index({ parent: 1 })

export default mongoose.model('Category', categorySchema)
