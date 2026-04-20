# Shopee Clone Frontend

Frontend dựng bằng React JSX + CSS, tách sẵn cấu trúc để nối NodeJS/Express/MongoDB sau này.

## Chạy dự án

```bash
npm install
npm run dev
```

## Tài khoản demo

- Email: demo@gmail.com
- Password: 123456

## Cấu trúc chính

- `src/pages`: các trang
- `src/components`: các thành phần giao diện
- `src/contexts`: auth/cart state
- `src/services`: lớp service để sau này thay mock bằng API thật
- `src/data`: dữ liệu mock
- `src/utils`: hàm dùng chung

## Gợi ý nối backend sau này

1. Thay `product.service.js` bằng API gọi Express.
2. Thay `auth.service.js` bằng API login/register thật.
3. Thay `cart.service.js` bằng API giỏ hàng theo user.
4. Giữ nguyên pages/components để không phải đập lại giao diện.
