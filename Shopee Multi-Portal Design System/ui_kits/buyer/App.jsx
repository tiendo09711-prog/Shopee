/* Buyer storefront — App orchestrator */

function App() {
  const [activeCat, setActiveCat] = React.useState('all');
  const [sort, setSort] = React.useState('popular');
  const [filters, setFilters] = React.useState({ category: 'all', minPrice: '', maxPrice: '', rating: 0 });
  const [cart, setCart] = React.useState([]);
  const [drawer, setDrawer] = React.useState(false);
  const [modal, setModal] = React.useState(null);
  const [favs, setFavs] = React.useState(new Set(['p2']));
  const [toast, setToast] = React.useState('');

  const products = window.BUYER.PRODUCTS.filter(p =>
    activeCat === 'all' ? true : p.category === activeCat
  );

  function openProduct(p) { setModal(p); }
  function addToCart(p, qty) {
    setCart(c => {
      const idx = c.findIndex(it => it.product.id === p.id);
      if (idx >= 0) {
        const next = [...c]; next[idx] = { ...next[idx], qty: next[idx].qty + qty }; return next;
      }
      return [...c, { product: p, qty }];
    });
    setToast('Đã thêm "' + p.name + '" vào giỏ hàng');
    setTimeout(() => setToast(''), 1800);
  }
  function removeFromCart(i) { setCart(c => c.filter((_, j) => j !== i)); }
  function toggleFav(id) {
    setFavs(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function checkout() {
    setDrawer(false);
    setToast('Đã chuyển đến trang thanh toán (demo)');
    setTimeout(() => setToast(''), 1800);
  }

  return (
    <>
      <Header
        cartCount={cart.reduce((s, it) => s + it.qty, 0)}
        wishlistCount={favs.size}
        onOpenCart={() => setDrawer(true)}
        onSearch={(k) => { setToast(k ? `Tìm: "${k}"` : 'Hiển thị tất cả'); setTimeout(() => setToast(''), 1500); }}
      />
      <main className="container">
        <Banner />
        <HighlightRow />
        <CategoryStrip active={activeCat} onSelect={setActiveCat} />
        <FlashSale products={window.BUYER.PRODUCTS} onOpen={openProduct} />
        <section className="uk-content">
          <FilterSidebar
            filters={{ ...filters, category: activeCat }}
            onChange={(k, v) => k === 'category' ? setActiveCat(v) : setFilters(f => ({ ...f, [k]: v }))}
            onReset={() => { setFilters({ category: 'all', minPrice: '', maxPrice: '', rating: 0 }); setActiveCat('all'); }}
          />
          <div>
            <SortBar sort={sort} onSort={setSort} />
            <ProductGrid products={products} onOpen={openProduct} onFav={toggleFav} favs={favs} />
          </div>
        </section>
      </main>
      <Footer />
      <ProductModal product={modal} onClose={() => setModal(null)} onAdd={addToCart} />
      <CartDrawer
        open={drawer}
        items={cart}
        onClose={() => setDrawer(false)}
        onRemove={removeFromCart}
        onCheckout={checkout}
      />
      {toast && <div className="uk-toast">{toast}</div>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
