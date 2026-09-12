import type { Product } from '../types'
import ProductCard from './ProductCard'

type ProductsGridProps = {
  products: Product[]
  isAdmin?: boolean
  onAddToCart: (product: Product) => void
  onDeleteProduct: (productId: number) => void
  onEditProduct: (product: Product) => void
}

export default function ProductsGrid({ products, isAdmin, onAddToCart, onDeleteProduct, onEditProduct }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">✦</div>
        <p className="empty-state__title">No encontramos productos</p>
        {isAdmin && (
          <p className="empty-state__description">Agrega tu primer producto usando el formulario de arriba.</p>
        )}
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAdmin={isAdmin}
          onAddToCart={onAddToCart}
          onDeleteProduct={onDeleteProduct}
          onEditProduct={onEditProduct}
        />
      ))}
    </div>
  )
}
