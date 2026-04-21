export const sellerDemoStats = {
  pendingConfirm: 0,
  waitingPickup: 0,
  processing: 0,
  cancelled: 0,
  lowStock: 2,
  hiddenProducts: 1,
  views: 128,
  visitors: 44,
  conversion: 3.2,
  revenueToday: 2560000,
}

export const defaultPickupAddress = {
  fullName: 'Đỗ Tiến',
  phone: '+84971129058',
  region: 'Hà Nội/Quận Ba Đình/Phường Quán Thánh',
  detail: 'Tòa Stela, Số 35, Lê Văn Thiêm, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội, Việt Nam',
  ward: 'Phường Thanh Xuân Trung',
  district: 'Quận Thanh Xuân',
  city: 'Hà Nội',
}

export const initialShippingSettings = [
  {
    id: 'express',
    group: 'Đơn Hỏa Tốc',
    title: 'Hỏa Tốc',
    badge: 'COD đã được kích hoạt',
    expanded: true,
    active: true,
    cod: true,
  },
  {
    id: 'same-day',
    group: 'Đơn thường',
    title: 'Trong Ngày',
    badge: 'COD đã được kích hoạt',
    expanded: true,
    active: true,
    cod: true,
  },
  {
    id: 'fast',
    group: 'Nhanh',
    title: 'Nhanh',
    badge: '',
    expanded: false,
    active: false,
    cod: false,
  },
  {
    id: 'pickup',
    group: 'Lấy hàng chủ động',
    title: 'Tủ Nhận Hàng',
    badge: 'COD đã được kích hoạt',
    expanded: true,
    active: true,
    cod: false,
  },
  {
    id: 'dropoff',
    group: 'Lấy hàng chủ động',
    title: 'Điểm nhận hàng',
    badge: 'COD đã được kích hoạt',
    expanded: true,
    active: true,
    cod: false,
  },
  {
    id: 'bulk',
    group: 'Hàng Cồng Kềnh',
    title: 'Hàng Cồng Kềnh',
    badge: '',
    expanded: false,
    active: false,
    cod: false,
  },
]

export const initialIdentityInfo = {
  businessType: 'Cá nhân',
  fullName: 'Đỗ Tiến',
  idNumber: '001097110958',
  issueDate: '2024-01-20',
  issuePlace: 'Cục Cảnh sát QLHC về TTXH',
}

export const initialTaxInfo = {
  taxCode: '0109711290',
  companyName: 'Shopee UNI',
  email: 'tiendo01628@gmail.com',
  address: 'Thanh Xuân, Hà Nội',
}

export const sellerSidebarSections = [
  {
    title: 'Tổng quan',
    items: [{ label: 'Kênh Người Bán', path: '/seller/dashboard' }],
  },
  {
    title: 'Quản Lý Sản Phẩm',
    items: [
      { label: 'Tất Cả Sản Phẩm', path: '/seller/products' },
      { label: 'Thêm Sản Phẩm', path: '/seller/products/new' },
      { label: 'Phân Loại', path: '/seller/products/categories' },
    ],
  },
  {
    title: 'Quản Lý Đơn Hàng',
    items: [
      { label: 'Tất cả', path: '/seller/orders' },
      { label: 'Chờ Xác Nhận', path: '/seller/orders?tab=pending' },
      { label: 'Đã Giao', path: '/seller/orders?tab=done' },
    ],
  },
  {
    title: 'Vận chuyển',
    items: [
      { label: 'Quản Lý Vận Chuyển', path: '/seller/shipping' },
      { label: 'Giao Hàng Loạt', path: '/seller/shipping/bulk' },
    ],
  },
  {
    title: 'Marketing',
    items: [{ label: 'Kênh Marketing', path: '/seller/marketing' }],
  },
  {
    title: 'Tài Chính',
    items: [{ label: 'Doanh Thu', path: '/seller/finance' }],
  },
  {
    title: 'Dữ Liệu',
    items: [{ label: 'Phân Tích Bán Hàng', path: '/seller/data' }],
  },
  {
    title: 'Chăm sóc khách hàng',
    items: [{ label: 'Trung Tâm Hỗ Trợ', path: '/seller/support' }],
  },
]
