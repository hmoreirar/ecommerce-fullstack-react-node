import type { CartItem } from '../types'
import { currencyFormatter } from '../utils'

type OrderReviewProps = {
  cart: CartItem[]
  shipping: { address: string; city: string; postalCode: string; phone: string }
  total: number
  onConfirm: () => void
  onBack: () => void
  loading?: boolean
}

export default function OrderReview({ cart, shipping, total, onConfirm, onBack, loading }: OrderReviewProps) {
  return (
    <div className="checkout-panel">
      <h2>Revisión de Orden</h2>

      <div className="review-grid">
        <div>
          <h3>Items</h3>
          {cart.map((item) => (
            <div key={item.id} className="review-item">
              <div>
                <p>{item.name}</p>
                <p className="review-item__meta">Cantidad: {item.quantity}</p>
              </div>
              <p className="review-item__price">{currencyFormatter.format(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div>
          <h3>Envío</h3>
          <div className="review-shipping">
            <p>{shipping.address}</p>
            <p>{shipping.city}, {shipping.postalCode}</p>
            <p>{shipping.phone}</p>
          </div>

          <div className="review-totals">
            <div className="review-totals__row">
              <span>Subtotal</span>
              <span>{currencyFormatter.format(total)}</span>
            </div>
            <div className="review-totals__row review-totals__row--grand">
              <span>Total</span>
              <span>{currencyFormatter.format(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Volver</button>
        <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={loading}>
          {loading ? 'Procesando...' : 'Confirmar Compra'}
        </button>
      </div>
    </div>
  )
}
