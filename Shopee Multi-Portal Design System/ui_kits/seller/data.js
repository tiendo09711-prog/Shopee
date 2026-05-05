/* Seller dashboard mock data */
window.SELLER = {
  PRODUCTS: [
    { id: 'sp_1', name: 'Áo Thun Nam Basic Form Rộng', sku: 'SP-001', stock: 124, price: 129000, status: 'Đang bán', img: 'shirt-white.svg', sold: 423 },
    { id: 'sp_2', name: 'Quần Jeans Nữ Ống Suông', sku: 'SP-002', stock: 58, price: 289000, status: 'Đang bán', img: 'shirt-black.svg', sold: 188 },
    { id: 'sp_3', name: 'Tai Nghe Bluetooth Mini', sku: 'SP-003', stock: 12, price: 349000, status: 'Sắp hết hàng', img: 'phone-cyan.svg', sold: 552 },
    { id: 'sp_4', name: 'Bình Giữ Nhiệt Inox 500ml', sku: 'SP-004', stock: 0, price: 99000, status: 'Tạm ẩn', img: 'watch-silver.svg', sold: 67 },
    { id: 'sp_5', name: 'Đồng Hồ Vàng Sang Trọng', sku: 'SP-005', stock: 45, price: 2790000, status: 'Đang bán', img: 'watch-gold.svg', sold: 92 },
    { id: 'sp_6', name: 'Áo Thun Đỏ Streetwear', sku: 'SP-006', stock: 230, price: 199000, status: 'Đang bán', img: 'shirt-red.svg', sold: 340 },
  ],
  ORDERS: [
    { id: 'od_1001', customer: 'Nguyễn Văn A', product: 'Áo Thun Nam Basic Form Rộng', total: 258000, status: 'Chờ xác nhận', shipping: 'Trong Ngày', createdAt: '03/05/2026 09:00' },
    { id: 'od_1002', customer: 'Trần Thị B', product: 'Tai Nghe Bluetooth Mini', total: 349000, status: 'Đang xử lý', shipping: 'Hỏa Tốc', createdAt: '03/05/2026 09:32' },
    { id: 'od_1003', customer: 'Lê Minh C', product: 'Quần Jeans Nữ Ống Suông', total: 289000, status: 'Đang giao', shipping: 'Nhanh', createdAt: '02/05/2026 16:45' },
    { id: 'od_1004', customer: 'Phạm Hồng D', product: 'Đồng Hồ Vàng Sang Trọng', total: 2790000, status: 'Đã giao', shipping: 'Nhanh', createdAt: '01/05/2026 11:20' },
    { id: 'od_1005', customer: 'Vũ Thanh E', product: 'Áo Thun Đỏ Streetwear', total: 398000, status: 'Đã giao', shipping: 'Tiết Kiệm', createdAt: '30/04/2026 14:10' },
  ],
  CHART: [42, 55, 38, 71, 64, 89, 92, 78, 84, 96, 102, 88, 110],
  CHART_LABELS: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};
