import { currencyFormatter } from '../utils'

type OrderConfirmationProps = {
  orderId: number
  total: number
  onContinue: () => void
}

export default function OrderConfirmation({ orderId, total, onContinue }: OrderConfirmationProps) {
  return (
    <div className="order-confirmation">
      <p className="eyebrow">Orden confirmada</p>
      <div className="order-confirmation__id">#{orderId}</div>
      <p>Tu compra fue registrada exitosamente.</p>
      <p className="order-confirmation__total">Total: {currencyFormatter.format(total)}</p>
      <button type="button" className="btn btn-primary" onClick={onContinue}>
        Seguir Comprando
      </button>
    </div>
  )
}
