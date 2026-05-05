import ApiError from '../utils/apiError.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import Seller from '../models/Seller.js'

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId })
  if (!cart) cart = await Cart.create({ user: userId, items: [] })
  return cart
}

export async function getCart(userId) {
  const cart = await getOrCreateCart(userId)
  return cart.populate([
    { path: 'items.product', select: 'name slug sku price oldPrice stock sold images status ratingAverage reviewCount' },
    { path: 'items.seller', select: 'shopName slug status' }
  ])
}

export async function addItem(userId, { productId, quantity = 1, selected = true }) {
  const product = await Product.findById(productId)
  if (!product || product.status !== 'active') throw new ApiError(400, 'Product is not available')
  if (product.stock <= 0) throw new ApiError(400, 'Product is out of stock')

  const nextQuantity = Number(quantity)
  if (!nextQuantity || nextQuantity < 1) throw new ApiError(400, 'Quantity must be greater than 0')
  if (nextQuantity > product.stock) throw new ApiError(400, 'Quantity exceeds product stock')

  const cart = await getOrCreateCart(userId)
  const existing = cart.items.find((item) => item.product.toString() === product._id.toString())
  if (existing) {
    const totalQuantity = existing.quantity + nextQuantity
    if (totalQuantity > product.stock) throw new ApiError(400, 'Quantity exceeds product stock')
    existing.quantity = totalQuantity
    existing.priceSnapshot = product.price
    existing.selected = selected
  } else {
    cart.items.push({
      product: product._id,
      seller: product.seller,
      quantity: nextQuantity,
      priceSnapshot: product.price,
      selected
    })
  }

  await cart.save()
  return getCart(userId)
}

export async function updateItem(userId, productId, { quantity, selected }) {
  const cart = await getOrCreateCart(userId)
  const item = cart.items.find((entry) => entry.product.toString() === productId)
  if (!item) throw new ApiError(404, 'Cart item not found')

  if (quantity !== undefined) {
    const product = await Product.findById(productId)
    if (!product || product.status !== 'active') throw new ApiError(400, 'Product is not available')
    const nextQuantity = Number(quantity)
    if (!nextQuantity || nextQuantity < 1) throw new ApiError(400, 'Quantity must be greater than 0')
    if (nextQuantity > product.stock) throw new ApiError(400, 'Quantity exceeds product stock')
    item.quantity = nextQuantity
    item.priceSnapshot = product.price
  }

  if (selected !== undefined) item.selected = Boolean(selected)
  await cart.save()
  return getCart(userId)
}

export async function removeItem(userId, productId) {
  const cart = await getOrCreateCart(userId)
  cart.items = cart.items.filter((item) => item.product.toString() !== productId)
  await cart.save()
  return getCart(userId)
}

export async function clearCart(userId) {
  const cart = await getOrCreateCart(userId)
  cart.items = []
  await cart.save()
  return cart
}
