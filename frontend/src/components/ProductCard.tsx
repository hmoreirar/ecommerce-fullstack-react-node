import type { Product } from '../types'

type ProductCardProps = {
  product: Product
  isAdmin?: boolean
  onAddToCart: (product: Product) => void
  onDeleteProduct: (productId: number) => void
}

export default function ProductCard({
  product,
  isAdmin,
  onAddToCart,
  onDeleteProduct,
}: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="product-card__image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-card__image--placeholder">
            Sin imagen
          </div>
        )}
      </div>

      <div className="product-card__info">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__price">
          {new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
          }).format(product.price)}
        </p>

        <div className="product-card__actions">
          <button
            onClick={() => onAddToCart(product)}
            className="btn btn-primary"
            style={{fontSize: '0.875rem', padding: '8px 12px'}}
            type="button"
          >
            Agregar
          </button>
          {isAdmin && (
            <button
              onClick={() => onDeleteProduct(product.id)}
              className="btn btn-secondary"
              style={{fontSize: '0.875rem', padding: '8px 12px', color: 'var(--color-error)'}}
              type="button"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
