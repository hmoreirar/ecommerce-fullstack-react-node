import type { CartItem } from '../types'

type CartSidebarProps = {
  cart: CartItem[]
  totalItems: number
  total: number
  loadingCheckout?: boolean
  onUpdateQuantity: (itemId: number, delta: number) => void
  onRemoveItem: (itemId: number) => void
  onCheckout: () => void
}

export default function CartSidebar({
  cart,
  totalItems,
  total,
  loadingCheckout,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  return (
    <aside className="cart-sidebar">
      <h2 style={{fontSize: '1.25rem', marginBottom: 20}}>Carrito de Compras</h2>

      {cart.length === 0 ? (
        <p style={{color: 'var(--color-foreground-light)', fontSize: '0.9rem', textAlign: 'center', padding: 20}}>
          Tu carrito está vacío
        </p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__info">
                <h4>{item.name}</h4>
                 <p className="cart-item__price">
                   {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(item.price)} x {item.quantity}
                 </p>
              </div>

              <div className="quantity-controls">
                <button onClick={() => onUpdateQuantity(item.id, -1)} type="button">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, 1)} type="button">+</button>
              </div>

              <button
                onClick={() => onRemoveItem(item.id)}
                style={{background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.875rem'}}
                type="button"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div style={{marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
              <span style={{color: 'var(--color-foreground-light)'}}>Items:</span>
              <span style={{fontWeight: 600}}>{totalItems}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
              <span style={{fontSize: '1.125rem', fontWeight: 600}}>Total:</span>
               <span style={{fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-accent)'}}>
                 {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(total)}
               </span>
            </div>

            <button
              className="btn btn-primary"
              disabled={cart.length === 0 || loadingCheckout}
              onClick={onCheckout}
              style={{width: '100%'}}
              type="button"
            >
              {loadingCheckout ? 'Procesando...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
