/* Sample data for the buyer storefront UI kit */
const PRODUCTS = [
  { id: 'p1', name: 'Điện Thoại Vsmart Active 3 6GB/64GB', price: 3190000, oldPrice: 3990000, discount: 20, rating: 4.6, sold: '1.2k', location: 'Quận 10, TP. HCM', img: 'phone-blue.svg', category: 'phone', sale: 73, stock: 99 },
  { id: 'p2', name: 'Đồng Hồ Classic Silver Dây Kim Loại', price: 1190000, oldPrice: 1590000, discount: 25, rating: 4.8, sold: '2.2k', location: 'Hà Nội', img: 'watch-silver.svg', category: 'watch', sale: 41, stock: 120 },
  { id: 'p3', name: 'Áo Thun Basic Màu Đỏ Cam Cotton 100%', price: 199000, oldPrice: 269000, discount: 26, rating: 4.4, sold: '2.3k', location: 'TP. HCM', img: 'shirt-red.svg', category: 'shirt', sale: 18, stock: 200 },
  { id: 'p4', name: 'iPhone 13 Pro 256GB Chính Hãng VN/A', price: 22990000, oldPrice: 25990000, discount: 12, rating: 4.9, sold: '8.4k', location: 'Hà Nội', img: 'phone-black.svg', category: 'phone', sale: 89, stock: 30 },
  { id: 'p5', name: 'Đồng Hồ Vàng Sang Trọng - Premium Edition', price: 2790000, oldPrice: 3490000, discount: 20, rating: 4.7, sold: '892', location: 'Đà Nẵng', img: 'watch-gold.svg', category: 'watch', sale: 56, stock: 60 },
  { id: 'p6', name: 'Áo Thun Trắng Unisex Cao Cấp', price: 159000, oldPrice: 219000, discount: 27, rating: 4.5, sold: '5.1k', location: 'TP. HCM', img: 'shirt-white.svg', category: 'shirt', sale: 30, stock: 500 },
  { id: 'p7', name: 'Điện Thoại Galaxy Xanh Mint 128GB', price: 5590000, oldPrice: 6990000, discount: 20, rating: 4.6, sold: '1.8k', location: 'Hà Nội', img: 'phone-cyan.svg', category: 'phone', sale: 64, stock: 80 },
  { id: 'p8', name: 'Đồng Hồ Đen Thể Thao Chống Nước', price: 890000, oldPrice: 1290000, discount: 31, rating: 4.3, sold: '654', location: 'Hải Phòng', img: 'watch-black.svg', category: 'watch', sale: 22, stock: 90 },
  { id: 'p9', name: 'Áo Thun Đen Form Rộng Streetwear', price: 229000, oldPrice: 299000, discount: 23, rating: 4.7, sold: '3.2k', location: 'TP. HCM', img: 'shirt-black.svg', category: 'shirt', sale: 47, stock: 220 },
  { id: 'p10', name: 'Điện Thoại Tím Mộng Mơ 8GB/256GB', price: 7990000, oldPrice: 9990000, discount: 20, rating: 4.8, sold: '976', location: 'Hà Nội', img: 'phone-purple.svg', category: 'phone', sale: 33, stock: 50 },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: '🛍' },
  { id: 'phone', label: 'Điện thoại', icon: '📱' },
  { id: 'watch', label: 'Đồng hồ', icon: '⌚' },
  { id: 'shirt', label: 'Thời trang', icon: '👕' },
  { id: 'home', label: 'Gia dụng', icon: '🏠' },
  { id: 'beauty', label: 'Sắc đẹp', icon: '💄' },
  { id: 'baby', label: 'Mẹ & bé', icon: '🍼' },
  { id: 'sport', label: 'Thể thao', icon: '⚽' },
  { id: 'food', label: 'Bách hóa', icon: '🍎' },
  { id: 'tech', label: 'Công nghệ', icon: '💻' },
];

const HOT_KEYWORDS = ['điện thoại', 'áo thun', 'đồng hồ', 'freeship', 'samsung', 'iphone', 'tai nghe', 'giày'];
const VOUCHERS = [
  { code: 'FREESHIP50', label: 'Miễn phí vận chuyển cho đơn từ 50K' },
  { code: 'SALE15', label: 'Giảm 15% tối đa 100K' },
  { code: 'NEWBIE', label: 'Khách mới giảm thêm 30K' },
  { code: 'SHOPEEPAY', label: 'Hoàn 5% khi thanh toán ShopeePay' },
];

window.BUYER = { PRODUCTS, CATEGORIES, HOT_KEYWORDS, VOUCHERS };
