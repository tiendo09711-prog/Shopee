import './SellerShared.css'

const steps = ['Thông tin Shop', 'Cài đặt vận chuyển', 'Thông tin định danh', 'Thông tin thuế', 'Hoàn tất']

function SellerOnboardingStepper({ currentStep = 0 }) {
  return (
    <div className="seller-stepper">
      {steps.map((step, index) => {
        const stateClass = index < currentStep ? 'done' : index === currentStep ? 'active' : ''
        return (
          <div key={step} className={`seller-step-item ${stateClass}`.trim()}>
            <div className="seller-step-dot" />
            <div>{step}</div>
          </div>
        )
      })}
    </div>
  )
}

export default SellerOnboardingStepper
