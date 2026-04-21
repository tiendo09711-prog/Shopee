import { shops } from '../data/products.mock'
import { getProductsByShop } from './product.service'

export function getAllShops() {
  return shops.map((shop) => ({
    ...shop,
    productsCount: getProductsByShop(shop.id).length
  }))
}

export function getShopById(shopId) {
  const shop = shops.find((item) => item.id === shopId)
  if (!shop) return null
  return {
    ...shop,
    productsCount: getProductsByShop(shopId).length
  }
}