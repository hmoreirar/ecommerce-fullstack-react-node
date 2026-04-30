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
    <div style={{maxWidth: 800, margin: '0 auto'}}>
      <h2 style={{marginBottom: 24}}>Revisión de Orden</h2>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        <div>
          <h3 style={{fontSize: '1rem', marginBottom: 16}}>Items</h3>
          {cart.map((item) => (
            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)'}}>
              <div>
                <p style={{fontWeight: 600, marginBottom: 4}}>{item.name}</p>
                <p style={{color: 'var(--color-foreground-light)', fontSize: '0.875rem'}}>Cantidad: {item.quantity}</p>
              </div>
              <p style={{fontWeight: 600}}>{currencyFormatter.format(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        
        <div>
          <h3 style={{fontSize: '1rem', marginBottom: 16}}>Envío</h3>
          <div style={{background: 'var(--color-surface)', padding: 16, borderRadius: 8}}>
            <p style={{marginBottom: 8}}>{shipping.address}</p>
            <p style={{marginBottom: 8}}>{shipping.city}, {shipping.postalCode}</p>
            <p>{shipping.phone}</p>
          </div>
          
          <div style={{marginTop: 24, paddingTop: 16, borderTop: '2px solid var(--color-border)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
              <span>Subtotal:</span>
              <span>{currencyFormatter.format(total)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem'}}>
              <span>Total:</span>
              <span style={{color: 'var(--color-accent)'}}>{currencyFormatter.format(total)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{display: 'flex', gap: 12, marginTop: 32}}>
        <button type="button" className="btn btn-secondary" onClick={onBack}>Volver</button>
        <button className="btn btn-primary" onClick={onConfirm} disabled={loading} style={{flex: 1}}>
          {loading ? 'Procesando...' : 'Confirmar Compra'}
        </button>
      </div>
    </div>
  )
}
