# Shopee Multi-Portal Frontend

Repo nay duoc tach thanh 3 frontend doc lap:

- `customer/`: cong `5173`
- `seller/`: cong `5174`
- `admin/`: cong `5175`

Moi app co `src`, `public`, `package.json`, `vite.config.js` rieng.

## Chay tung app

Mo terminal tai dung thu muc app muon chay:

```bash
cd customer
npm install
npm run dev
```

```bash
cd seller
npm install
npm run dev
```

```bash
cd admin
npm install
npm run dev
```

## Mock Accounts Cho Backend

### 1. Customer demo account

Nguon du lieu:

- `customer/src/services/auth.service.js`

Tai khoan mac dinh:

- Email: `demo@gmail.com`
- Password: `123456`
- User ID: `u_demo`
- Ten hien thi: `hihihi1111`
- Phone: `0123123123`
- Address: `123123123123`

### 2. Seller demo account

Nguon du lieu:

- `seller/src/services/auth.service.js`
- `seller/src/contexts/SellerContext.jsx`

Seller dang dung chung buyer account de dang nhap buoc dau, sau do kiem tra them seller profile.

Thong tin dang nhap seller demo:

- Buyer email: `demo@gmail.com`
- Buyer password: `123456`
- Seller password: `123456`
- Shop name: `demo_shop`
- User ID: `u_demo`

Identifier seller login dang chap nhan:

- `demo@gmail.com`
- `demo_shop`

### 3. Admin

Admin hien la frontend mock dashboard:

## Goi Y Noi Backend

### Customer

Co the map backend vao:

- `customer/src/services/auth.service.js`
- `customer/src/services/product.service.js`
- `customer/src/services/cart.service.js`
- `customer/src/services/order.service.js`
- `customer/src/services/notification.service.js`

### Seller

Co the map backend vao:

- `seller/src/services/auth.service.js`
- `seller/src/contexts/SellerContext.jsx`
- `seller/src/data/seller.mock.js`
- `seller/src/data/sellerProducts.mock.js`
- `seller/src/data/sellerOrders.mock.js`

### Admin
