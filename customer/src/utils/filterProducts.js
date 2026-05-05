export function filterAndSortProducts(products, filters) {
  const {
    keyword = '',
    category = '',
    minPrice = '',
    maxPrice = '',
    rating = 0,
    sort = 'newest'
  } = filters

  let result = [...products]

  if (keyword.trim()) {
    const normalized = keyword.toLowerCase().trim()
    result = result.filter((product) =>
      [
        product.name,
        product.description,
        product.brand,
        product.sku,
        product.categoryName,
        product.category
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalized))
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

  if (sort === 'popular') {
    result.sort((a, b) => b.views - a.views)
  } else if (sort === 'bestSeller') {
    result.sort((a, b) => b.sold - a.sold)
  } else if (sort === 'priceAsc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sort === 'priceDesc') {
    result.sort((a, b) => b.price - a.price)
  } else {
    result.sort((a, b) => b.createdAt - a.createdAt)
  }

  return result
}
