# Admin Console — Shopee UI Kit

Pixel-leaning recreation of the Shopee Admin panel — adapted to a warm parchment + Space Grotesk display aesthetic that the source codebase aims for. Source code in `/admin/src/`.

## Components
- `Dashboard.jsx` — `AdminSidebar`, `PageHead`, `StatGrid`, `Dashboard` (revenue chart + activity feed).
- `Pages.jsx` — `UsersPage` (tabbed table), `OrdersPage` (stats + recent orders table).
- `App.jsx` — sidebar router; non-implemented sections render a friendly placeholder pointing back to source.

## Interactions
- Sidebar nav switches between Dashboard / Users / Orders / placeholders.
- Page action pills and table actions emit a toast.
- Tabs in Users page filter the table.
