# Seller Dashboard — Shopee UI Kit

Pixel-leaning recreation of the Shopee Seller Center. Source code in `/seller/src/`.

## Components
- `Sidebar.jsx` — `SellerSidebar` (logo + grouped nav, active orange left rail) and `SellerTopBar` (search, "Đơn cần xử lý" pill, avatar).
- `Dashboard.jsx` — gradient banner, 4 stat cards, 14-day revenue bar chart, recent orders list.
- `Orders.jsx` — tabbed orders table (Chờ xác nhận / Đang xử lý / Đang giao / Đã giao …), bulk toolbar, status pills.
- `Products.jsx` — tabbed product table with thumbnail, SKU, stock, sold count, status pill.
- `App.jsx` — page router for sidebar nav.

## Interactions
- Click any sidebar item to switch page; pages outside the three implemented areas show a friendly placeholder.
- Click table actions (Xác nhận / Sửa / In) to fire a toast.
- Tabs filter the table by status.
