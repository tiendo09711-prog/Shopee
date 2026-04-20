import { products } from '../data/products.mock'

export function getAllProducts() {
  return [...products]
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}

export function getBestSellerProducts(limit = 6, excludeId = '') {
  return products
    .filter((product) => product.isBestSeller && product.id !== excludeId)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
}
