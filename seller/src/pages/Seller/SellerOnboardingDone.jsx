import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'

function SellerOnboardingDone() {
  return (
    <SellerOnboardingLayout step={4}>
      <div style={{ minHeight: '58vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ width: 120, height: 120, margin: '0 auto 22px', borderRadius: '50%', background: '#fff7ed', display: 'grid', placeItems: 'center', fontSize: 52 }}>…</div>
          <h1 style={{ marginBottom: 12, fontWeight: 500 }}>Đã gửi hồ sơ người bán</h1>
          <p className="seller-muted" style={{ marginBottom: 28 }}>Shop đang ở trạng thái chờ Admin duyệt. Bạn chưa thể vào dashboard cho đến khi trạng thái là approved.</p>
        </div>
      </div>
    </SellerOnboardingLayout>
  )
}

export default SellerOnboardingDone
