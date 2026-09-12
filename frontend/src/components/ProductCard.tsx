import type { Product } from '../types'

type ProductCardProps = {
  product: Product
  isAdmin?: boolean
  onAddToCart: (product: Product) => void
  onDeleteProduct: (productId: number) => void
  onEditProduct: (product: Product) => void
}

export default function ProductCard({
  product,
  isAdmin,
  onAddToCart,
  onDeleteProduct,
  onEditProduct,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-card__image--placeholder">
            <span>Imagen próximamente</span>
          </div>
        )}
      </div>

      <div className="product-card__info">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__category">{product.category}</p>
        {product.tags.length > 0 && (
          <div className="product-card__tags">
            {product.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
        )}
        <p className="product-card__price">
          {new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
          }).format(product.price)}
        </p>
        <p className="product-card__stock">
          {product.stock && product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
        </p>

        <div className="product-card__actions">
          <button
            onClick={() => onAddToCart(product)}
            className="btn btn-primary"
            disabled={!product.stock || product.stock <= 0}
            aria-label={`Agregar ${product.name} al carrito`}
            type="button"
          >
            {product.stock && product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
          </button>
          {isAdmin && (
            <button
              onClick={() => onEditProduct(product)}
              className="btn btn-secondary"
              aria-label={`Editar ${product.name}`}
              type="button"
            >
              Editar
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => onDeleteProduct(product.id)}
              className="btn btn-secondary"
              aria-label={`Eliminar ${product.name}`}
              type="button"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
