# Shopee Multi-Portal Design System — Skill

A design system extracted from a Vietnamese-language Shopee clone with three React frontends: **customer storefront**, **seller dashboard**, and **admin control panel**. Use this skill when designing any new screen, flow, or asset for any of the three portals.

## When to use this skill
- Mocking up a new customer-facing storefront screen (home, search, PDP, cart, checkout, account).
- Designing seller-side admin tooling (dashboard, product manager, order list, finance).
- Designing platform admin tools (user management, shop approval, finance, reports).
- Any cross-portal artifact (deck, doc, marketing page) that must look like Shopee.

## Index of files

| Path | Purpose |
|---|---|
| `README.md` | Full design system specification — content fundamentals, color, type, spacing, components, iconography. **Read first.** |
| `colors_and_type.css` | All design tokens. `--shopee-*` for customer/seller, `--admin-*` for admin. Import via `<link rel="stylesheet" href="colors_and_type.css">` or copy into your file. |
| `assets/products/*.svg` | Canonical demo product library — phones (7 colorways), shirts (3), watches (3). Use these instead of generating new product art. |
| `assets/login-illustration.svg` | Small login flourish for auth screens. |
| `preview/*.html` | Design System tab cards. Reference only — do not import. |
| `ui_kits/customer/` | Buyer storefront components: `Header`, `Banner`, `CategoryStrip`, `Products`, `ProductModal`. React + Babel. |
| `ui_kits/seller/` | Seller dashboard components: `Sidebar`, `Dashboard`, `Products`, `Orders`. React + Babel. |
| `ui_kits/admin/` | Admin panel components: `AdminSidebar`, `Dashboard`, `UsersPage`, `OrdersPage`. Parchment aesthetic, IBM Plex / Space Grotesk. |
| `customer/`, `seller/`, `admin/` | The original imported source code from `tiendo09711-prog/Shopee` — read for ground-truth markup/state when in doubt. |

## How to use the kits

Each `ui_kits/<portal>/` folder is a runnable demo. To build something new:

1. **Read `README.md` first** — voice/tone, casing rules, color usage, hover/press behavior. This is non-negotiable.
2. **Copy the relevant `ui_kits/<portal>/styles.css`** into your new file's folder, plus `colors_and_type.css` from the project root.
3. **Lift components** from the JSX files. Each kit exports its components to `window` so they can be reused. Pattern:
   ```html
   <link rel="stylesheet" href="../colors_and_type.css">
   <link rel="stylesheet" href="styles.css">
   <script src="https://unpkg.com/react@18.3.1/..."></script>
   <script src="data.js"></script>
   <script type="text/babel" src="Header.jsx"></script>
   <script type="text/babel" src="App.jsx"></script>
   ```
4. **Pull product imagery** from `assets/products/`. Don't draw new SVG products — the colorways are deliberate.

## Hard rules

- **Never mix portal namespaces.** Customer/seller use `--shopee-*` tokens (Roboto, `#ee4d2d` orange, `4px` radii, white surfaces). Admin uses `--admin-*` tokens (IBM Plex / Space Grotesk, `#f6f1eb` parchment, `#f15a24` accent, `14–24px` radii). Cross-pollinating produces visually broken designs.
- **Vietnamese first, fully accented.** Production copy uses full diacritics (`Tìm kiếm`, not `Tim kiem`). Source has some unaccented strings — fix them, don't propagate them.
- **Sentence case Vietnamese** for all UI copy. Only the discount badge "GIẢM" and admin eyebrow text are uppercase.
- **No emoji as brand voice.** The codebase uses 🌐 🔍 ❤ 🔔 🛒 as placeholders for icons. Replace with **Lucide** SVG icons (or copy the inline SVG in production), don't ship emoji.
- **No real product photography in chrome.** Banners, headers, and category strips are CSS gradients + flat SVGs. Photography is OK only on white card surfaces, never full-bleed.
- **Restrained motion.** Fade and `translateY(-2px)` only. No bounces, scale-ins, parallax, or scroll-triggered animations.
- **Currency:** `đ` symbol after the number, dot thousand separators (`350.000đ`). Compact at scale ("triệu" / "tỷ").

## Quick reference

**Customer storefront vibe:** loud Shopee mass-market — orange gradient header, white product cards on `#f5f5f5` page, yellow→orange discount tags, 5-column product grid at desktop, `1200px` container.

**Seller dashboard vibe:** calmer admin in Shopee orange — white surfaces with thin `#eee` borders (no shadow), `1280px` container, three-column dashboard `220 | 1fr | 280`, fixed left sidebar.

**Admin panel vibe:** boutique parchment — cream `#f6f1eb` page, `#fffaf3` panels with `1px` warm-ink borders and `0 20px 50px rgba(91,63,33,.08)` shadow, `24px` rounded cards, IBM Plex body / Space Grotesk display, two faint radial gradients on the body background.

## When in doubt
- Open the imported source under `customer/src/`, `seller/src/`, or `admin/src/` — that's the canonical reference.
- The Design System tab (`preview/*.html`) shows every token rendered.
- If a screen doesn't exist in any portal yet, ask the user which portal it should live in **before** picking a visual language.
