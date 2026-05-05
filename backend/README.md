# PShop Backend

Backend Express + MongoDB Atlas cho dự án PShop.

## Stack

- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT access token + refresh token
- bcryptjs
- dotenv, cors, helmet, morgan
- express-validator
- multer local upload mock

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Điền `MONGODB_URI` trong `.env` bằng connection string MongoDB Atlas database `pshop`.

```bash
npm run seed
npm run dev
```

Health check:

```bash
GET http://localhost:5000/api/health
```

## Demo Accounts

- Admin: `admin@pshop.vn` / `admin123456`
- Customer: `customer@pshop.vn` / `customer123456`
- Seller approved: `seller@pshop.vn` / `seller123456`
- Seller pending: `seller.pending@pshop.vn` / `seller123456`

## Seed

`npm run seed`:

1. Kết nối MongoDB.
2. Xóa collections theo thứ tự an toàn.
3. Insert dữ liệu từ `src/seed/data/*.json`.
4. Hash password bằng bcrypt trước khi insert users.
5. Recalculate `category.productsCount`, `seller.totalProducts`, `seller.totalSales`, `product.ratingAverage`, `product.reviewCount`.

Seed JSON dùng Extended JSON (`$oid`, `$date`) để có thể import bằng MongoDB Compass/Atlas hoặc insert qua script.

## Transaction Note

Checkout ở phase sau sẽ dùng MongoDB session transaction. MongoDB Atlas cluster hỗ trợ transaction vì chạy replica set. Nếu dùng MongoDB local standalone, transaction có thể lỗi; hãy chạy replica set local hoặc dùng Atlas.

## API Base URL

Frontend sẽ dùng:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

CORS hiện allow:

- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
