import { getAllProducts, getProductsByShop } from './product.service'

function buildShopFromProducts(shopId) {
  const products = getProductsByShop(shopId)
  const firstProduct = products[0]
  if (!firstProduct) return null

  return {
    id: shopId,
    name: firstProduct.shopName || 'PShop',
    rating: firstProduct.seller?.ratingAverage || 0,
    followers: 0,
    responseRate: 95,
    responseTime: 'trong vài giờ',
    productsCount: products.length
  }
}

export function getAllShops() {
  const productGroups = new Map()
  getAllProducts().forEach((product) => {
    if (!product.shopId) return
    productGroups.set(product.shopId, true)
  })
  return Array.from(productGroups.keys()).map(buildShopFromProducts).filter(Boolean)
}

export function getShopById(shopId) {
  return buildShopFromProducts(shopId)
}
