import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import Banner from '../../components/Banner/Banner'
import CategoryStrip from '../../components/CategoryStrip/CategoryStrip'
import FlashSale from '../../components/FlashSale/FlashSale'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchCategories, fetchProducts, getHotKeywords } from '../../services/product.service'
import { getPlatformVouchers, getShopVouchers } from '../../services/voucher.service'
import './Home.css'

const initialFilters = {
  keyword: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  rating: 0,
  sort: 'newest',
  page: 1,
  pageSize: 10
}

const SORT_VALUES = ['newest', 'popular', 'bestSeller', 'priceAsc', 'priceDesc']
const PAGE_SIZE_VALUES = [10, 20, 40]

function toPositiveNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function getFiltersFromParams(searchParams) {
  const sort = searchParams.get('sort') || initialFilters.sort
  const pageSize = toPositiveNumber(searchParams.get('pageSize'), initialFilters.pageSize)
  return {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: toPositiveNumber(searchParams.get('rating'), 0),
    sort: SORT_VALUES.includes(sort) ? sort : initialFilters.sort,
    page: toPositiveNumber(searchParams.get('page'), 1),
    pageSize: PAGE_SIZE_VALUES.includes(pageSize) ? pageSize : initialFilters.pageSize
  }
}

function buildSearchParams(filters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value === '' || value === 0 || value === initialFilters[key]) return
    params.set(key, String(value))
  })
  return params
}

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => getFiltersFromParams(searchParams))
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [bestSellerSuggestions, setBestSellerSuggestions] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const pageCount = Math.max(1, pagination.totalPages || 1)
  const currentPage = Math.min(filters.page, pageCount)
  const hotKeywords = getHotKeywords()
  const vouchers = [...getPlatformVouchers(), ...getShopVouchers()].slice(0, 4)

  useEffect(() => {
    setFilters(getFiltersFromParams(searchParams))
  }, [searchParams])

  useEffect(() => {
    let active = true
    fetchCategories()
      .then((items) => {
        if (active) setCategories(items)
      })
      .catch(() => {
        if (active) setCategories([])
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchProducts(filters)
      .then((data) => {
        if (!active) return
        setProducts(data.products)
        setPagination(data.pagination)
      })
      .catch((fetchError) => {
        if (!active) return
        setError(fetchError.message)
        setProducts([])
        setPagination({ page: filters.page, limit: filters.pageSize, total: 0, totalPages: 1 })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [filters])

  useEffect(() => {
    let active = true
    fetchProducts({ sort: 'bestSeller', page: 1, pageSize: 5 })
      .then((data) => {
        if (active) setBestSellerSuggestions(data.products)
      })
      .catch(() => {
        if (active) setBestSellerSuggestions([])
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!loading && filters.page > pageCount) {
      const nextFilters = { ...filters, page: pageCount }
      setFilters(nextFilters)
      setSearchParams(buildSearchParams(nextFilters), { replace: true })
    }
  }, [filters, loading, pageCount, setSearchParams])

  const updateFilters = (nextFilters, options = {}) => {
    setFilters(nextFilters)
    setSearchParams(buildSearchParams(nextFilters), { replace: options.replace ?? false })
  }

  const handleChangeFilter = (key, value) => {
    const nextFilters = {
      ...filters,
      [key]: value,
      page: key === 'page' ? Number(value) : 1
    }
    updateFilters(nextFilters)
  }

  const handleReset = () => updateFilters(initialFilters)

  const renderPagination = () => {
    if (pagination.total === 0) return null

    return (
      <div className="home-pagination card">
        <div className="home-page-size">
          <span>Hiển thị</span>
          <select value={filters.pageSize} onChange={(e) => handleChangeFilter('pageSize', Number(e.target.value))}>
            {PAGE_SIZE_VALUES.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <span>/ trang</span>
        </div>
        <div className="home-page-controls">
          <button type="button" disabled={currentPage <= 1} onClick={() => handleChangeFilter('page', currentPage - 1)}>Trước</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button key={page} type="button" className={page === currentPage ? 'active' : ''} onClick={() => handleChangeFilter('page', page)}>
              {page}
            </button>
          ))}
          <button type="button" disabled={currentPage >= pageCount} onClick={() => handleChangeFilter('page', currentPage + 1)}>Sau</button>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <Banner />
      <section className="container home-highlight-row">
        <div className="home-voucher-card">
          <h3>Voucher hôm nay</h3>
          <div className="home-voucher-list">
            {vouchers.map((voucher) => (
              <div key={voucher.code} className="home-voucher-item">
                <strong>{voucher.code}</strong>
                <span>{voucher.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="home-hot-keywords-card">
          <h3>Tìm kiếm nổi bật</h3>
          <div className="home-hot-keywords">
            {hotKeywords.map((keyword) => (
              <Link key={keyword} to={`/?keyword=${encodeURIComponent(keyword)}`}>{keyword}</Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryStrip categories={categories} activeCategory={filters.category} onSelectCategory={(value) => handleChangeFilter('category', value)} />
      <FlashSale products={products} />
      <section className="container page-spacing home-content">
        <FilterSidebar categories={categories} filters={filters} onChange={handleChangeFilter} onReset={handleReset} />
        <div className="home-product-area">
          {filters.keyword ? <div className="search-notice card">Kết quả cho từ khóa: <strong>{filters.keyword}</strong></div> : null}
          {error ? <div className="empty-message card">{error}</div> : null}
          {loading ? <div className="empty-message card">Đang tải sản phẩm...</div> : null}
          {!loading && !error && products.length > 0 ? (
            <>
              <ProductGrid products={products} totalCount={pagination.total} currentPage={currentPage} pageCount={pageCount} />
              {renderPagination()}
            </>
          ) : null}
          {!loading && !error && products.length === 0 ? (
            <div className="home-empty-wrap">
              <div className="empty-message">Không tìm thấy kết quả phù hợp</div>
              <section className="home-suggestion-section">
                <h3>Gợi ý sản phẩm bán chạy</h3>
                <div className="home-suggestion-grid">
                  {bestSellerSuggestions.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </section>
    </MainLayout>
  )
}

export default Home
