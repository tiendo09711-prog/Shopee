import './CategoryStrip.css'

function CategoryStrip({ activeCategory, onSelectCategory, categories = [] }) {
  return (
    <section className="category-strip container card">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.id)}
        >
          <span className="category-icon">🏷️</span>
          <span>{category.name}</span>
        </button>
      ))}
      <button type="button" className={`category-chip ${!activeCategory ? 'active' : ''}`} onClick={() => onSelectCategory('')}>
        <span className="category-icon">✨</span>
        <span>Tất cả</span>
      </button>
    </section>
  )
}

export default CategoryStrip
