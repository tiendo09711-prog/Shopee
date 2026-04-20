import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import Banner from '../../components/Banner/Banner'
import CategoryStrip from '../../components/CategoryStrip/CategoryStrip'
import FlashSale from '../../components/FlashSale/FlashSale'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { getAllProducts } from '../../services/product.service'
import { filterAndSortProducts } from '../../utils/filterProducts'
import './Home.css'

const initialFilters = { keyword: '', category: '', minPrice: '', maxPrice: '', rating: 0, sortBy: 'newest', priceOrder: '' }

function Home() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({ ...initialFilters, keyword: searchParams.get('keyword') || '' })
  const allProducts = useMemo(() => getAllProducts(), [])
  const filteredProducts = useMemo(() => filterAndSortProducts(allProducts, filters), [allProducts, filters])

  useEffect(() => {
    setFilters((prev) => ({ ...prev, keyword: searchParams.get('keyword') || '' }))
  }, [searchParams])

  const handleChangeFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const handleReset = () => setFilters(initialFilters)

  return (
    <MainLayout>
      <Banner />
      <CategoryStrip activeCategory={filters.category} onSelectCategory={(value) => handleChangeFilter('category', value)} />
      <FlashSale products={allProducts} />
      <section className="container page-spacing home-content">
        <FilterSidebar filters={filters} onChange={handleChangeFilter} onReset={handleReset} />
        <div className="home-product-area">
          {filters.keyword ? <div className="search-notice card">Kết quả cho từ khóa: <strong>{filters.keyword}</strong></div> : null}
          {filteredProducts.length > 0 ? <ProductGrid products={filteredProducts} /> : <div className="empty-message">Không tìm thấy sản phẩm phù hợp.</div>}
        </div>
      </section>
    </MainLayout>
  )
}

export default Home
