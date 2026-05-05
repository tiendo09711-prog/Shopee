import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerApprovalWaiting() {
  const { seller } = useSeller()
  const isRejected = seller?.status === 'rejected'
  const isLocked = seller?.status === 'locked'

  return (
    <SellerOnboardingLayout step={4}>
      <div style={{ minHeight: '58vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ width: 120, height: 120, margin: '0 auto 22px', borderRadius: '50%', background: isRejected || isLocked ? '#fff1f0' : '#fff7ed', display: 'grid', placeItems: 'center', fontSize: 52 }}>
            {isRejected || isLocked ? '!' : '…'}
          </div>
          <h1 style={{ marginBottom: 12, fontWeight: 500 }}>
            {isLocked ? 'Shop đang bị khóa' : isRejected ? 'Hồ sơ người bán bị từ chối' : 'Đang chờ Admin duyệt'}
          </h1>
          <p className="seller-muted" style={{ marginBottom: 28 }}>
            {isLocked
              ? 'Bạn không thể vào dashboard cho đến khi Admin mở khóa.'
              : isRejected
                ? seller?.rejectReason || 'Vui lòng cập nhật hồ sơ theo lý do từ chối.'
                : 'Hồ sơ shop đã được gửi sang Admin. Sau khi được duyệt, bạn mới có thể vào dashboard.'}
          </p>
        </div>
      </div>
    </SellerOnboardingLayout>
  )
}

export default SellerApprovalWaiting
