type Step = {
  number: number
  title: string
}

const steps: Step[] = [
  { number: 1, title: 'Carrito' },
  { number: 2, title: 'Envío' },
  { number: 3, title: 'Revisión' },
  { number: 4, title: 'Confirmación' },
]

type CheckoutStepperProps = {
  currentStep: number
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div style={{display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32}}>
      {steps.map((step) => (
        <div key={step.number} style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: currentStep >= step.number ? 'var(--color-accent)' : 'var(--color-border)',
            color: currentStep >= step.number ? '#fff' : 'var(--color-foreground-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            {step.number}
          </div>
          <span style={{
            color: currentStep >= step.number ? 'var(--color-foreground)' : 'var(--color-foreground-light)',
            fontSize: '0.875rem',
            fontWeight: currentStep === step.number ? 600 : 400
          }}>
            {step.title}
          </span>
        </div>
      ))}
    </div>
  )
}
