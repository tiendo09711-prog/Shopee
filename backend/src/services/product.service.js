import mongoose from 'mongoose'
import ApiError from '../utils/apiError.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'
import Seller from '../models/Seller.js'
import User from '../models/User.js'
import { buildPaginationMeta, getPagination } from '../utils/pagination.js'

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function resolveCategoryId(category) {
  if (!category) return null
  if (mongoose.Types.ObjectId.isValid(category)) return category

  const categoryDoc = await Category.findOne({
    $or: [
      { slug: category },
      { name: new RegExp(`^${escapeRegex(category)}$`, 'i') }
    ]
  }).select('_id')

  return categoryDoc?._id || null
}

function buildSort(sort) {
  const sortMap = {
    newest: { createdAt: -1 },
    popular: { sold: -1, reviewCount: -1 },
    bestSeller: { sold: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 }
  }

  return sortMap[sort] || sortMap.newest
}

export async function listPublicProducts(query) {
  const { page, limit, skip } = getPagination(query)
  const filter = { status: 'active' }

  if (query.keyword) {
    const regex = new RegExp(escapeRegex(query.keyword), 'i')
    filter.$or = [
      { name: regex },
      { description: regex },
      { sku: regex }
    ]
  }

  const categoryId = await resolveCategoryId(query.category)
  if (query.category && !categoryId) {
    return {
      products: [],
      pagination: buildPaginationMeta(page, limit, 0)
    }
  }
  if (categoryId) filter.category = categoryId

  if (query.seller && mongoose.Types.ObjectId.isValid(query.seller)) filter.seller = query.seller

  if (query.minPrice || query.maxPrice) {
    filter.price = {}
    if (query.minPrice) filter.price.$gte = Number(query.minPrice)
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice)
  }

  if (query.rating) filter.ratingAverage = { $gte: Number(query.rating) }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug image')
      .populate('seller', 'shopName slug logo ratingAverage status')
      .sort(buildSort(query.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ])

  return {
    products,
    pagination: buildPaginationMeta(page, limit, total)
  }
}

export async function getPublicProductBySlugOrId(slugOrId) {
  const query = mongoose.Types.ObjectId.isValid(slugOrId)
    ? { _id: slugOrId, status: 'active' }
    : { slug: slugOrId, status: 'active' }

  const product = await Product.findOne(query)
    .populate('category', 'name slug image')
    .populate('seller', 'shopName slug logo coverImage description ratingAverage status')
    .lean()

  if (!product) throw new ApiError(404, 'Product not found')
  return product
}

export async function listProductReviews(productIdOrSlug, query) {
  const { page, limit, skip } = getPagination(query)
  const product = await getPublicProductBySlugOrId(productIdOrSlug)

  const filter = {
    product: product._id,
    status: 'visible'
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter)
  ])

  const normalizedReviews = reviews.map((review) => ({
    ...review,
    customer: review.anonymous ? { name: 'Người dùng ẩn danh', avatar: '' } : review.customer
  }))

  return {
    reviews: normalizedReviews,
    pagination: buildPaginationMeta(page, limit, total)
  }
}
