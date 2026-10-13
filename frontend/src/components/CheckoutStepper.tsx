type CheckoutStepperProps = {
  currentStep: number
}

const steps = [
  { number: 1, title: 'Carrito' },
  { number: 2, title: 'Envío' },
  { number: 3, title: 'Revisión' },
  { number: 4, title: 'Confirmación' },
]

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="checkout-stepper">
      {steps.map((step) => {
        const state = currentStep > step.number
          ? 'checkout-step--done'
          : currentStep === step.number
            ? 'checkout-step--active'
            : ''

        return (
          <div key={step.number} className={`checkout-step ${state}`}>
            <div className="checkout-step__number">{step.number}</div>
            <span className="checkout-step__label">{step.title}</span>
          </div>
        )
      })}
    </div>
  )
}
