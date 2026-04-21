export function filterAndSortProducts(products, filters) {
  const {
    keyword = '',
    category = '',
    minPrice = '',
    maxPrice = '',
    rating = 0,
    sortBy = 'newest',
    priceOrder = ''
  } = filters

  let result = [...products]

  if (keyword.trim()) {
    const normalized = keyword.toLowerCase().trim()
    result = result.filter((product) =>
      product.name.toLowerCase().includes(normalized)
    )
  }

  if (category) {
    result = result.filter((product) => product.category === category)
  }

  if (minPrice !== '') {
    result = result.filter((product) => product.price >= Number(minPrice))
  }

  if (maxPrice !== '') {
    result = result.filter((product) => product.price <= Number(maxPrice))
  }

  if (rating > 0) {
    result = result.filter((product) => product.rating >= rating)
  }

  if (sortBy === 'popular') {
    result.sort((a, b) => b.views - a.views)
  } else if (sortBy === 'bestSeller') {
    result.sort((a, b) => b.sold - a.sold)
  } else {
    result.sort((a, b) => b.createdAt - a.createdAt)
  }

  if (priceOrder === 'asc') {
    result.sort((a, b) => a.price - b.price)
  }

  if (priceOrder === 'desc') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
}
