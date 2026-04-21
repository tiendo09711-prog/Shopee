import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerShippingSection from '../../components/Seller/SellerShippingSection'
import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerOnboardingShipping() {
  const navigate = useNavigate()
  const { seller, updateShippingSettings } = useSeller()
  const [settings, setSettings] = useState(seller?.shippingSettings || [])

  const groups = useMemo(() => [...new Set(settings.map((item) => item.group))], [settings])
  const patchItem = (id, patch) => setSettings((prev) => prev.map((item) => item.id === id ? { ...item, ...patch } : item))

  return (
    <SellerOnboardingLayout step={1}>
      {groups.map((group) => (
        <SellerShippingSection
          key={group}
          title={group}
          items={settings.filter((item) => item.group === group)}
          onToggleExpanded={(id) => patchItem(id, { expanded: !settings.find((item) => item.id === id)?.expanded })}
          onToggleActive={(id) => patchItem(id, { active: !settings.find((item) => item.id === id)?.active })}
          onToggleCod={(id) => patchItem(id, { cod: !settings.find((item) => item.id === id)?.cod })}
        />
      ))}
      <div className="seller-form-actions" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="seller-outline-btn" onClick={() => navigate('/seller/onboarding/shop-info')}>Quay lại</button>
        <button type="button" className="seller-primary-btn" onClick={() => { updateShippingSettings(settings); navigate('/seller/onboarding/identity') }}>Tiếp theo</button>
      </div>
    </SellerOnboardingLayout>
  )
}

export default SellerOnboardingShipping
