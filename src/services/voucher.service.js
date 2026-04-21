const platformVouchers = [
  { code: 'FREESHIP30', label: 'Giảm phí vận chuyển 30.000đ', type: 'shipping', value: 30000, minSpend: 150000 },
  { code: 'XTRA50K', label: 'Giảm 50.000đ', type: 'discount', value: 50000, minSpend: 500000 },
  { code: 'SALE10', label: 'Giảm 10%', type: 'percent', value: 10, maxDiscount: 120000, minSpend: 300000 }
]

const shopVouchers = [
  { code: 'SHOP20K', label: 'Voucher shop 20.000đ', type: 'discount', value: 20000, minSpend: 200000 },
  { code: 'SHOP5', label: 'Voucher shop 5%', type: 'percent', value: 5, maxDiscount: 60000, minSpend: 300000 }
]

export function getPlatformVouchers() {
  return platformVouchers
}

export function getShopVouchers() {
  return shopVouchers
}

export function calculateVoucherDiscount(subtotal, shippingFee, voucherCodes = []) {
  const allVouchers = [...platformVouchers, ...shopVouchers]
  let discount = 0
  let shippingDiscount = 0
  const applied = []

  voucherCodes.forEach((code) => {
    const voucher = allVouchers.find((item) => item.code === code)
    if (!voucher) return
    if (subtotal < voucher.minSpend) return

    if (voucher.type === 'shipping') {
      const amount = Math.min(shippingFee, voucher.value)
      shippingDiscount += amount
      applied.push(voucher)
      return
    }

    if (voucher.type === 'discount') {
      discount += voucher.value
      applied.push(voucher)
      return
    }

    if (voucher.type === 'percent') {
      const amount = Math.min(Math.round((subtotal * voucher.value) / 100), voucher.maxDiscount || Infinity)
      discount += amount
      applied.push(voucher)
    }
  })

  return { discount, shippingDiscount, applied }
}