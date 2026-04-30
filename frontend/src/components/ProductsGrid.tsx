import type { Product } from '../types'
import ProductCard from './ProductCard'

type ProductsGridProps = {
  products: Product[]
  isAdmin?: boolean
  onAddToCart: (product: Product) => void
  onDeleteProduct: (productId: number) => void
}

export default function ProductsGrid({ products, isAdmin, onAddToCart, onDeleteProduct }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div style={{textAlign: 'center', padding: 60, color: 'var(--color-foreground-light)'}}>
        <p style={{fontSize: '1.125rem', marginBottom: 8}}>No hay productos aún</p>
        {isAdmin && (
          <p style={{fontSize: '0.875rem'}}>Agrega tu primer producto usando el formulario de arriba</p>
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
        />
      ))}
    </div>
  )
}
