const now = Date.now()

function timeOffset(daysAgo) {
  return now - daysAgo * 24 * 60 * 60 * 1000
}

function review(author, rating, content, daysAgo, images = []) {
  return {
    id: `${author.toLowerCase().replace(/\s+/g, '_')}_${daysAgo}`,
    author,
    rating,
    content,
    createdAt: timeOffset(daysAgo),
    images
  }
}

function shop(id, name, joinedYear, responseRate, followers, rating) {
  return {
    id,
    name,
    joinedYear,
    responseRate,
    responseTime: 'trong vài phút',
    followers,
    rating,
    productsCount: 0,
    location: 'TP. Hồ Chí Minh',
    avatar: '',
    isMall: true
  }
}

export const shops = [
  shop('shop_apple', 'Apple Flagship Store', 2020, 98, 245000, 4.9),
  shop('shop_samsung', 'Samsung Official', 2019, 97, 198000, 4.8),
  shop('shop_xiaomi', 'Xiaomi Digital', 2021, 95, 123000, 4.7),
  shop('shop_fashion', 'Street Fashion Hub', 2022, 96, 88000, 4.7),
  shop('shop_watch', 'Watch World Mall', 2018, 99, 66000, 4.8),
  shop('shop_mobile', 'Mobile Giá Tốt', 2021, 94, 71000, 4.6)
]

export const products = [
  {
    id: 'p001',
    slug: 'dien-thoai-vsmart-active-3-6gb-64gb',
    name: 'Điện Thoại Vsmart Active 3 6GB/64GB - Hàng Chính Hãng',
    category: 'phone',
    price: 3190000,
    oldPrice: 3990000,
    discountPercent: 20,
    rating: 4.6,
    sold: 1200,
    views: 103200,
    stock: 138,
    createdAt: timeOffset(1),
    images: ['/assets/products/phone-blue.svg','/assets/products/phone-purple.svg','/assets/products/phone-black.svg','/assets/products/phone-green.svg'],
    description: 'Vsmart Active 3 có thiết kế hiện đại, hiệu năng ổn định, phù hợp cho nhu cầu học tập, làm việc và giải trí hằng ngày.',
    brand: 'Vsmart',
    shopId: 'shop_mobile',
    shippingFee: 32000,
    shippingLeadTime: 'Nhận từ 2 - 4 ngày',
    location: 'Quận 10, TP. Hồ Chí Minh',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Xanh dương', 'Tím', 'Đen', 'Xanh lá'] },
      { name: 'Phiên bản', options: ['6GB/64GB', '8GB/128GB'] }
    ],
    reviewStats: { 5: 120, 4: 32, 3: 10, 2: 4, 1: 3 },
    reviews: [
      review('Nguyễn Minh', 5, 'Máy đẹp, giao nhanh, đóng gói chắc chắn.', 2, ['/assets/products/phone-blue.svg']),
      review('Trần Phương', 4, 'Dùng ổn trong tầm giá, pin đủ một ngày.', 4)
    ]
  },
  {
    id: 'p002',
    slug: 'dien-thoai-oppo-a12-3gb-32gb',
    name: 'Điện thoại OPPO A12 (3GB/32GB) - Hàng chính hãng',
    category: 'phone',
    price: 2590000,
    oldPrice: 3490000,
    discountPercent: 26,
    rating: 4.5,
    sold: 6800,
    views: 92400,
    stock: 85,
    createdAt: timeOffset(4),
    images: ['/assets/products/phone-cyan.svg','/assets/products/phone-blue.svg','/assets/products/phone-black.svg'],
    description: 'OPPO A12 nổi bật với pin tốt, màn hình rộng và kiểu dáng trẻ trung.',
    brand: 'OPPO',
    shopId: 'shop_mobile',
    shippingFee: 30000,
    shippingLeadTime: 'Nhận từ 2 - 5 ngày',
    location: 'TP. Hồ Chí Minh',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Xanh cyan', 'Xanh dương', 'Đen'] },
      { name: 'Phiên bản', options: ['3GB/32GB'] }
    ],
    reviewStats: { 5: 320, 4: 89, 3: 22, 2: 9, 1: 8 },
    reviews: [review('Hà An', 5, 'Giá ổn, máy dùng mượt, mua cho phụ huynh rất hợp.', 3)]
  },
  {
    id: 'p003',
    slug: 'dien-thoai-apple-iphone-12-64gb-do',
    name: 'Điện thoại Apple Iphone 12 64GB - Hàng chính hãng VNA',
    category: 'phone',
    price: 20990000,
    oldPrice: 26990000,
    discountPercent: 22,
    rating: 5,
    sold: 482,
    views: 24800,
    stock: 21,
    createdAt: timeOffset(2),
    images: ['/assets/products/phone-red.svg','/assets/products/phone-white.svg','/assets/products/phone-green.svg','/assets/products/phone-blue.svg'],
    description: 'iPhone 12 mang lại trải nghiệm cao cấp với thiết kế vuông vức, hiệu năng mạnh mẽ và cụm camera ổn định.',
    brand: 'Apple',
    shopId: 'shop_apple',
    shippingFee: 18000,
    shippingLeadTime: 'Nhận từ ngày mai',
    location: 'Hà Nội',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Đỏ', 'Trắng', 'Xanh lá', 'Xanh dương'] },
      { name: 'Dung lượng', options: ['64GB', '128GB', '256GB'] }
    ],
    reviewStats: { 5: 543, 4: 48, 3: 7, 2: 2, 1: 1 },
    reviews: [
      review('Lê Hồng', 5, 'Hàng chuẩn, kích hoạt bình thường, shop uy tín.', 2, ['/assets/products/phone-red.svg']),
      review('Vũ Đức', 5, 'Mượt, camera đẹp, sẽ ủng hộ shop lần sau.', 7)
    ]
  },
  {
    id: 'p004',
    slug: 'dien-thoai-realme-c11-2gb-32gb',
    name: 'Điện Thoại Realme C11 (2GB/32GB) - Hàng chính hãng',
    category: 'phone',
    price: 2130000,
    oldPrice: 2690000,
    discountPercent: 21,
    rating: 4.4,
    sold: 5600,
    views: 77300,
    stock: 66,
    createdAt: timeOffset(8),
    images: ['/assets/products/phone-green.svg','/assets/products/phone-cyan.svg','/assets/products/phone-black.svg'],
    description: 'Realme C11 là sản phẩm phổ thông có thiết kế dễ dùng, pin khỏe và mức giá dễ tiếp cận.',
    brand: 'Realme',
    shopId: 'shop_mobile',
    shippingFee: 28000,
    shippingLeadTime: 'Nhận từ 2 - 4 ngày',
    location: 'Bình Dương',
    isBestSeller: false,
    variations: [
      { name: 'Màu', options: ['Xanh lá', 'Xanh cyan', 'Đen'] },
      { name: 'Phiên bản', options: ['2GB/32GB'] }
    ],
    reviewStats: { 5: 205, 4: 91, 3: 30, 2: 12, 1: 5 },
    reviews: [review('Khánh Linh', 4, 'Máy ổn với nhu cầu cơ bản.', 5)]
  },
  {
    id: 'p005',
    slug: 'dien-thoai-samsung-galaxy-a54-xanh',
    name: 'Điện thoại Samsung Galaxy A54 - Xanh Mint',
    category: 'phone',
    price: 8990000,
    oldPrice: 9990000,
    discountPercent: 10,
    rating: 4.8,
    sold: 2300,
    views: 68900,
    stock: 45,
    createdAt: timeOffset(5),
    images: ['/assets/products/phone-green.svg','/assets/products/phone-white.svg','/assets/products/phone-black.svg'],
    description: 'Galaxy A54 cân bằng giữa thiết kế đẹp, camera tốt và màn hình hiển thị sắc nét.',
    brand: 'Samsung',
    shopId: 'shop_samsung',
    shippingFee: 15000,
    shippingLeadTime: 'Nhận từ ngày mai',
    location: 'Đà Nẵng',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Xanh Mint', 'Trắng', 'Đen'] },
      { name: 'Phiên bản', options: ['8GB/128GB', '8GB/256GB'] }
    ],
    reviewStats: { 5: 264, 4: 58, 3: 10, 2: 3, 1: 1 },
    reviews: [review('Thu Trang', 5, 'Màn hình đẹp, pin ổn, ship nhanh.', 1)]
  },
  {
    id: 'p006',
    slug: 'dien-thoai-xiaomi-redmi-note-13-xanh-duong',
    name: 'Điện thoại Xiaomi Redmi Note 13 - Xanh dương',
    category: 'phone',
    price: 5790000,
    oldPrice: 6490000,
    discountPercent: 11,
    rating: 4.7,
    sold: 1700,
    views: 53300,
    stock: 59,
    createdAt: timeOffset(3),
    images: ['/assets/products/phone-blue.svg','/assets/products/phone-cyan.svg','/assets/products/phone-black.svg'],
    description: 'Redmi Note 13 có hiệu năng tốt trong tầm giá, màn hình lớn và pin ổn định.',
    brand: 'Xiaomi',
    shopId: 'shop_xiaomi',
    shippingFee: 22000,
    shippingLeadTime: 'Nhận từ 2 - 3 ngày',
    location: 'TP. Hồ Chí Minh',
    isBestSeller: false,
    variations: [
      { name: 'Màu', options: ['Xanh dương', 'Xanh cyan', 'Đen'] },
      { name: 'Phiên bản', options: ['8GB/128GB', '8GB/256GB'] }
    ],
    reviewStats: { 5: 189, 4: 47, 3: 15, 2: 4, 1: 2 },
    reviews: [review('Duy Khoa', 5, 'Mượt trong tầm giá, loa khá to.', 6)]
  },
  {
    id: 'p013',
    slug: 'dong-ho-classic-silver',
    name: 'Đồng Hồ Classic Silver Dây Kim Loại',
    category: 'watch',
    price: 1190000,
    oldPrice: 1590000,
    discountPercent: 25,
    rating: 4.8,
    sold: 2200,
    views: 55100,
    stock: 77,
    createdAt: timeOffset(11),
    images: ['/assets/products/watch-silver.svg','/assets/products/watch-black.svg','/assets/products/watch-gold.svg'],
    description: 'Mẫu đồng hồ cổ điển dễ phối đồ, kiểu dáng sang trọng, phù hợp cho đi làm và đi chơi.',
    brand: 'Classic',
    shopId: 'shop_watch',
    shippingFee: 16000,
    shippingLeadTime: 'Nhận từ 2 - 4 ngày',
    location: 'Hà Nội',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Bạc', 'Đen', 'Vàng'] },
      { name: 'Size', options: ['40mm', '42mm'] }
    ],
    reviewStats: { 5: 302, 4: 50, 3: 12, 2: 3, 1: 1 },
    reviews: [review('Phúc Hưng', 5, 'Đeo đẹp, sang, đúng hình.', 9)]
  },
  {
    id: 'p014',
    slug: 'dong-ho-sport-black',
    name: 'Đồng Hồ Sport Black Chống Nước Cơ Bản',
    category: 'watch',
    price: 890000,
    oldPrice: 1190000,
    discountPercent: 25,
    rating: 4.6,
    sold: 1800,
    views: 43600,
    stock: 54,
    createdAt: timeOffset(16),
    images: ['/assets/products/watch-black.svg','/assets/products/watch-silver.svg'],
    description: 'Đồng hồ sport phù hợp với người thích phong cách năng động, mặt đồng hồ rõ và dễ sử dụng.',
    brand: 'SportX',
    shopId: 'shop_watch',
    shippingFee: 16000,
    shippingLeadTime: 'Nhận từ 2 - 4 ngày',
    location: 'Hải Phòng',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Đen', 'Bạc'] },
      { name: 'Size', options: ['40mm', '44mm'] }
    ],
    reviewStats: { 5: 211, 4: 66, 3: 18, 2: 5, 1: 3 },
    reviews: [review('Nam Trần', 4, 'Đẹp, cứng cáp, hợp giá tiền.', 8)]
  },
  {
    id: 'p016',
    slug: 'ao-thun-basic-trang',
    name: 'Áo Thun Basic Form Rộng Màu Trắng',
    category: 'shirt',
    price: 179000,
    oldPrice: 249000,
    discountPercent: 28,
    rating: 4.5,
    sold: 6400,
    views: 81200,
    stock: 144,
    createdAt: timeOffset(10),
    images: ['/assets/products/shirt-white.svg','/assets/products/shirt-red.svg','/assets/products/shirt-black.svg'],
    description: 'Áo thun basic form rộng, chất vải dễ mặc và phù hợp để phối đồ hằng ngày.',
    brand: 'BasicLab',
    shopId: 'shop_fashion',
    shippingFee: 18000,
    shippingLeadTime: 'Nhận từ 2 - 3 ngày',
    location: 'TP. Hồ Chí Minh',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Trắng', 'Đỏ', 'Đen'] },
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] }
    ],
    reviewStats: { 5: 560, 4: 123, 3: 29, 2: 7, 1: 6 },
    reviews: [
      review('Bảo Châu', 5, 'Chất áo ổn, form đẹp, giao hàng nhanh.', 2, ['/assets/products/shirt-white.svg']),
      review('Lê My', 4, 'Mặc thoải mái, nên mua.', 6)
    ]
  },
  {
    id: 'p017',
    slug: 'ao-thun-basic-do',
    name: 'Áo Thun Basic Màu Đỏ Cam',
    category: 'shirt',
    price: 199000,
    oldPrice: 269000,
    discountPercent: 26,
    rating: 4.4,
    sold: 2300,
    views: 29800,
    stock: 91,
    createdAt: timeOffset(13),
    images: ['/assets/products/shirt-red.svg','/assets/products/shirt-white.svg','/assets/products/shirt-black.svg'],
    description: 'Mẫu áo thun màu nổi, phù hợp cho phong cách trẻ trung và năng động.',
    brand: 'StreetWear',
    shopId: 'shop_fashion',
    shippingFee: 18000,
    shippingLeadTime: 'Nhận từ 2 - 3 ngày',
    location: 'TP. Hồ Chí Minh',
    isBestSeller: false,
    variations: [
      { name: 'Màu', options: ['Đỏ cam', 'Trắng', 'Đen'] },
      { name: 'Size', options: ['M', 'L', 'XL'] }
    ],
    reviewStats: { 5: 201, 4: 60, 3: 19, 2: 4, 1: 2 },
    reviews: [review('Hoàng Long', 5, 'Màu đẹp, form ổn.', 12)]
  },
  {
    id: 'p018',
    slug: 'ao-thun-basic-den',
    name: 'Áo Thun Basic Màu Đen',
    category: 'shirt',
    price: 189000,
    oldPrice: 259000,
    discountPercent: 27,
    rating: 4.6,
    sold: 3200,
    views: 42100,
    stock: 103,
    createdAt: timeOffset(15),
    images: ['/assets/products/shirt-black.svg','/assets/products/shirt-white.svg','/assets/products/shirt-red.svg'],
    description: 'Áo thun basic màu đen dễ phối và hợp với nhiều phong cách, từ đi học đến đi chơi.',
    brand: 'StreetWear',
    shopId: 'shop_fashion',
    shippingFee: 18000,
    shippingLeadTime: 'Nhận từ 2 - 3 ngày',
    location: 'TP. Hồ Chí Minh',
    isBestSeller: true,
    variations: [
      { name: 'Màu', options: ['Đen', 'Trắng', 'Đỏ'] },
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] }
    ],
    reviewStats: { 5: 287, 4: 74, 3: 16, 2: 4, 1: 1 },
    reviews: [review('Thuỳ Anh', 5, 'Áo đẹp, đáng tiền.', 11)]
  }
]

for (const store of shops) {
  store.productsCount = products.filter((product) => product.shopId === store.id).length
}