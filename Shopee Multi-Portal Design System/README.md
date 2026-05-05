# Shopee Multi-Portal Design System

A design system extracted from a 3-portal Shopee-style e-commerce clone:
**customer** (storefront), **seller** (shop dashboard), and **admin** (platform control panel).

## Sources

- **GitHub:** `tiendo09711-prog/Shopee` — three Vite/React frontends running on ports 5173 / 5174 / 5175. Imported under `customer/`, `seller/`, and `admin/` in this project.
- **Visual style:** Vietnamese Shopee-clone — bright orange brand (`#ee4d2d`), white surfaces, gray neutrals. The customer + seller portals stay tightly aligned to the canonical Shopee palette; the admin portal goes its own way (warm cream parchment + IBM Plex / Space Grotesk).
- **Language:** Vietnamese-first. Some inline strings are unaccented (legacy ASCII), most are accented Vietnamese (`Tìm kiếm`, `Đã bán`, `Giỏ hàng`).

## Index

- `colors_and_type.css` — all design tokens (color, type, radii, shadow, layout)
- `assets/` — product SVGs (phones, watches, shirts in colorways) + login illustration
- `preview/` — Design System tab cards (colors, type, components, brand)
- `ui_kits/customer/` — buyer storefront UI kit (header, banner, product grid, cart, checkout)
- `ui_kits/seller/` — seller dashboard UI kit (sidebar, banner, stats, tasks, table)
- `ui_kits/admin/` — admin control panel UI kit (parchment shell, hero, summary, table)
- `SKILL.md` — agent skill manifest

## Three portals, two visual languages

| Portal   | Vibe                              | Key colors                          | Type                                      |
|----------|-----------------------------------|-------------------------------------|-------------------------------------------|
| Customer | Loud Shopee mass-market           | `#ee4d2d` orange, white, light gray | Roboto 400/500/700                        |
| Seller   | Calmer admin dressed in orange    | Same orange, more whitespace        | Roboto 400/500/700                        |
| Admin    | Boutique parchment dashboard      | Cream `#f6f1eb`, accent `#f15a24`   | IBM Plex Sans (body) / Space Grotesk (h)  |

Customer and seller share `:root` tokens (`--shopee-orange`, `--text-main`, `--shadow`, etc.); admin defines a totally separate `--admin-*` namespace.

---

## CONTENT FUNDAMENTALS

The product is a Vietnamese-language Shopee clone, so copy is short, imperative, sentence-cased Vietnamese with diacritics. Tone is functional and transactional — no marketing flourish.

**Voice & tone**
- **Direct, instructional.** "Đăng nhập", "Mua ngay", "Thêm vào giỏ", "Thanh toán". Verbs first.
- **Sentence case** for buttons and headings (`Voucher hôm nay`, `Tìm kiếm nổi bật`). Never ALL-CAPS except for the discount badge ("GIẢM").
- **Second-person implicit** — Vietnamese rarely uses pronouns; copy reads as a command to the user. No "Bạn" / "Tôi".
- **No emoji as content.** Emoji only appear as inline icon stand-ins in code (🌐 🔍 ❤ 🔔 🛒) — these should be replaced with real icons in production. Treat as placeholders, not brand voice.
- **Mixed accent fidelity.** Some strings in the codebase are unaccented ASCII Vietnamese (`Hien thi`, `Truoc`, `Sau`); production copy should use full diacritics (`Hiển thị`, `Trước`, `Sau`).
- **Currency:** `đ` symbol, dot thousand separators (`350,000đ` or `2.48 tỷ`). Numbers compact at scale ("triệu" / "tỷ").

**Examples (verbatim from codebase)**

| Surface           | Copy                                                  |
|-------------------|-------------------------------------------------------|
| Header utility    | `Kênh Người Bán` · `Kết nối` · `Tải ứng dụng`         |
| Auth links        | `Đăng ký` · `Đăng nhập`                               |
| Search field      | placeholder via `t('searchPlaceholder')`              |
| Voucher card      | `Voucher hôm nay` · `Tìm kiếm nổi bật`                |
| Empty state       | `Khong tim thay ket qua phu hop` (should be accented) |
| Product meta      | `Đã bán 1.2k` · `TP. Hồ Chí Minh`                     |
| Discount badge    | `20%` ▸ `GIẢM`                                        |
| Cart actions      | `Thanh toán` · primary; `Xóa` link-style              |
| Admin section     | `Tổng quan` · `Quản lý người dùng` · `Báo cáo`        |
| Admin eyebrow     | All caps tracking (e.g., `OVERVIEW`)                  |

**Casing rules**
- Headings: Sentence case Vietnamese.
- Buttons: Sentence case Vietnamese, often single verb.
- Labels: Sentence case ("Tên shop", "Số điện thoại").
- Status pills: Sentence case ("Đang giao", "Hoàn trả").
- Admin eyebrow only: UPPERCASE + 0.12em tracking (Space Grotesk display).

---

## VISUAL FOUNDATIONS

### Color
- **Primary brand:** `#ee4d2d` Shopee orange. Used on prices, buttons, links, active states, badges, and the entire customer header (vertical gradient `#ee4d2d → #ff7337`).
- **Secondary orange ramp:** `#fb5533` (search button), `#d73211` (pressed), `#ff8b6e → #f53d2d` (banner gradient), `#ff6a00 → #ffb347` (seller banner), `#ffbda7 → #ff664f` (flash-sale "sold" pill).
- **Neutrals:** background `#f5f5f5` / `#f6f6f6`, surfaces white, lines `#e5e5e5` and `#ededed`, text main `#222`, muted `#757575`.
- **Semantic:** success `#30b566` (toggle `#55c46b`), danger `#d0011b` (deep) / `#ff424f`, warning `#f6a400`, info `#1677ff`, star `#ffce3d`.
- **Discount badge:** yellow `#ffd84d` background, orange text — a Shopee signature.
- **Admin namespace** is parchment: `#f6f1eb` page, `#fffaf3` panels, `#f15a24` accent, with two soft radial gradients in the body.

### Type
- **Customer + seller:** `Roboto 300/400/500/700`. Sizes 12–34px.
- **Admin:** `IBM Plex Sans` body, `Space Grotesk` for `h1/h2` and brand strong text. Hero h1 uses `clamp(30px, 4vw, 46px)`.
- **Weights are purposeful:** 400 body, 500 buttons / titles / page heads, 700 prices and stat numbers. No 600 in customer/seller.
- Line heights: tight `1.1` for huge banner / hero, `1.5` body, `1.7` for admin hero copy.

### Spacing & layout
- **Container widths:** `1200px` customer, `1280px` seller dashboard, `1180px` seller onboarding, full-width responsive admin.
- **Spacing rhythm** (px): `4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 36 · 56`. No 8-pt grid — Shopee uses both even and odd values.
- **Sticky header** offsets: header height ~102px → filter sidebars use `top: 102px`, checkout summary uses `top: 110px`, seller sidebar uses `top: 16px`.
- **Grid columns** are fluid: customer home is `220px | 1fr`, seller dashboard is `220px | 1fr | 280px`, admin is `320px | 1fr`.

### Backgrounds
- **No imagery in chrome.** Header is a solid orange gradient, banners are CSS gradients with simulated phone shapes drawn from divs (no real product photos).
- **Product surfaces:** white card on `#f7f7f7` thumb backdrop. Aspect ratio `1/1`, `object-fit: contain` (not crop).
- **Admin body:** two faint radial gradients (orange-top-left, blue-bottom-right) over cream — gives a quiet "Notion-meets-paper" warmth without competing with content.

### Animation
- Customer cards: `transform 0.18s ease, box-shadow 0.18s ease` on hover — `translateY(-2px)` + lifted shadow.
- Seller toggle: `0.2s` for the knob slide.
- Admin nav: `0.18s ease` background/colour swap on hover/active.
- **No bounces, no scale-in, no parallax, no scroll-triggered anims.** This system is restrained — fade and translate only.

### Hover states
- **Cards:** lift `-2px` + deeper shadow (customer product card).
- **Filter chips / category links / sidebar items:** swap to brand orange text, sometimes add a tinted bg (`#fff7f5`, `#fff5f1`).
- **Admin nav:** entire pill turns solid `#f15a24` with white text.
- **Suggestion list, dropdown menu items:** background → `#fafafa`.

### Press / disabled
- Buttons darken to `--shopee-orange-dark` (`#d73211`).
- Disabled buttons: text `#aaa` / `#bbb`, background `#f7f7f7`, `cursor: not-allowed`.

### Borders
- Default lines: `1px solid #e5e5e5`. Inputs: `1px solid #d9d9d9`. Cards have soft borders (`#ececec`, `#efefef`) instead of strong shadows in seller portal.
- Dashed borders mark voucher coupons (`1px dashed #ee4d2d`) and chart placeholders (`1px dashed #ddd`).
- Admin lines are barely-there ink: `rgba(53, 40, 26, 0.12)`.

### Shadows
- **Customer surface:** `0 2px 10px rgba(0,0,0,.08)` — generic card shadow.
- **Hover lift:** `0 10px 20px rgba(0,0,0,.08)`.
- **Popover/menu:** `0 10px 28px rgba(0,0,0,.12)`.
- **Search suggestions:** `0 10px 30px rgba(0,0,0,.12)`.
- **Auth card:** `0 2px 16px rgba(0,0,0,.08)`.
- **Admin lush shadow:** `0 20px 50px rgba(91, 63, 33, 0.08)` — warm-tinted, deeper, 50px blur.

### Radii
- `4px` is the workhorse (cards, buttons, search bar). `2–3px` for inputs/auth. `6–12px` for some pages (cart quantity control, checkout cards). `999px` for badges & admin pill buttons. **Admin** breaks the rules with `14px`/`24px` chunky cards.

### Layout rules
- Sticky header (`z-index: 20`) with thin top utility strip + main row (logo / search / icons).
- Filter sidebar fixed-width 220px, sticky under header.
- Card-based grid for products (5 columns desktop, 3 tablet, 2 mobile).
- Admin sidebar fixed-width 320px, full-height sticky.

### Transparency / blur
- `rgba(255,255,255,0.14)` for header utility-strip dividers (subtle darker line in the gradient).
- `rgba(255,255,255,0.2)` for header avatar fallback bg.
- `rgba(255,251,245,0.95)` admin panel — frosted parchment over the radial gradients.
- **No backdrop-filter / no real blur** is used.

### Imagery vibe
- **Bright, primary-color, flat illustrations.** Product SVGs are minimalist solid-color phone/shirt/watch silhouettes (purple/red/cyan/green colorways) — they're stand-ins meant to read at thumbnail size.
- **No photography in the codebase.** No grain, no warm-tone treatments, no full-bleed lifestyle imagery. If real photos are introduced they should be daylight, neutral-warm, and sit on the white card surface (not bleed).

### Cards
- **Customer product card:** white, `radius 4px`, `shadow 0 1px 2px rgba(0,0,0,.08)` at rest, lift on hover. Discount badge nests in top-right corner with a yellow→orange clip. Wishlist heart top-right with semi-transparent white pill background.
- **Seller info card:** thin `#eee` border, no shadow, `radius 4px`. The seller portal explicitly prefers borders over shadow.
- **Admin card:** chunky, `radius 24px`, soft `1px` warm-ink border, generous `0 20px 50px` shadow, parchment background.

### Iconography
See ICONOGRAPHY section below.

---

## ICONOGRAPHY

**Status of icons in source:** the codebase ships **no icon library**. Inline emoji are used as visual stand-ins in JSX:

- 🌐 language switcher
- 🔍 search submit
- ❤ wishlist heart
- 🔔 notifications bell
- 🛒 cart
- ★ rating star (Unicode)
- "S" letter as the Shopee mark inside a white rounded square

These are placeholder-grade. For any production-quality artifact built from this design system **substitute a real icon set** — the recommendation here is **Lucide** (https://lucide.dev) via CDN: it's stroke-based, modern, free, and matches Shopee's clean weight. Map: `Search` → 🔍, `Heart` → ❤, `Bell` → 🔔, `ShoppingCart` → 🛒, `Globe` → 🌐, `Star` (filled) → ★.

> ⚠ **Substitution flagged:** Lucide is being recommended in lieu of the codebase's emoji placeholders. The original Shopee site uses a custom in-house icon font/SVG set we don't have access to. Confirm with the user before shipping production code.

**SVG assets (all in `assets/`):**
- `assets/login-illustration.svg` — small login flourish (used by both customer & seller auth pages)
- `assets/products/phone-{black,blue,cyan,green,purple,red,white}.svg` — minimalist phone colorways
- `assets/products/shirt-{black,red,white}.svg` — flat shirt silhouettes
- `assets/products/watch-{black,gold,silver}.svg` — watch dial silhouettes

Use these for any product mock — they're the canonical "demo product" library.

**No emoji in the brand.** Whatever emoji appear in source are stand-ins; do not lean on them as a brand voice signal.

**No icon font.** Don't introduce one — keep iconography as inline SVG (Lucide via CDN or copied) so it inherits color via `currentColor`.

---

## Notes & known caveats

- The codebase mixes accented and unaccented Vietnamese — production copy should normalize to fully accented.
- Admin uses a fundamentally different visual language than customer/seller. Keep them in their own namespaces; do not cross-pollinate (`--shopee-*` ↔ `--admin-*`).
- Real Shopee uses Lazada/Shopee proprietary icons + product photography; this clone substitutes flat SVGs and emoji. Replace before shipping.
- Fonts (Roboto, IBM Plex Sans, Space Grotesk) are loaded via Google Fonts in `colors_and_type.css`. No local TTF files. Inter is also pulled in for completeness in case the user wants the slightly more modern alternative (the spec note mentioned "Inter or similar").
