# Buyer Storefront — Shopee UI Kit

Pixel-leaning recreation of the Shopee buyer storefront. Source code in `/customer/src/`.

## Components
- `Header.jsx` — utility bar, gradient main bar with logo, search + hot keywords, wishlist/notif/cart icons with badge counters.
- `Banner.jsx` — hero promo + voucher and hot-keyword highlight cards.
- `CategoryStrip.jsx` — circle-icon category strip + Flash Sale row with countdown clock and "ĐÃ BÁN" progress bar.
- `Products.jsx` — `FilterSidebar`, `SortBar`, `ProductCard`, `ProductGrid`.
- `ProductModal.jsx` — full product detail overlay, cart drawer, footer.
- `App.jsx` — orchestrates state (cart, wishlist, modal, toasts).

## Interactions in `index.html`
- Click any product card or flash sale tile → opens detail modal with quantity stepper, "Thêm vào giỏ hàng", "Mua ngay".
- Heart icon → toggles wishlist.
- Cart icon → opens right-side drawer with totals, Xóa, Thanh toán.
- Header search and hot keywords → emit a toast preview.
- Sidebar filter / category strip / sort bar → re-filter the grid.

All copy is Vietnamese (sentence case, friendly imperative) and uses brand orange (#ee4d2d). Product imagery is the in-house demo SVG library.
