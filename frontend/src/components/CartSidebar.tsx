import type { CartItem } from '../types'
import { currencyFormatter } from '../utils'

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
      <div className="cart-sidebar__heading">
        <h2>Carrito</h2>
        <span className="cart-sidebar__count">{totalItems} items</span>
      </div>

      {cart.length === 0 ? (
        <p className="cart-empty">Tu carrito está vacío.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__info">
                <span className="cart-item__name">{item.name}</span>
                <span className="cart-item__price">
                  {currencyFormatter.format(item.price)} x {item.quantity}
                </span>
                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    aria-label={`Reducir cantidad de ${item.name}`}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    aria-label={`Aumentar cantidad de ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="remove-item"
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Eliminar ${item.name} del carrito`}
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="cart-total">
            <span>Total</span>
            <span>{currencyFormatter.format(total)}</span>
          </div>

          <button
            className="btn btn-primary"
            disabled={cart.length === 0 || loadingCheckout}
            onClick={onCheckout}
            type="button"
          >
            {loadingCheckout ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </div>
      )}
    </aside>
  )
}
