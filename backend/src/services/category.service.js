import Category from '../models/Category.js'

export async function listPublicCategories() {
  return Category.find({ status: 'active' })
    .sort({ sortOrder: 1, name: 1 })
    .lean()
}
