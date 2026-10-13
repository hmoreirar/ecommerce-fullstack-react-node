import type { FormEvent } from 'react'

type ProductFormProps = {
  name: string
  price: string
  image: string
  stock: string
  category: string
  tags: string
  editing: boolean
  loading?: boolean
  onNameChange: (value: string) => void
  onPriceChange: (value: string) => void
  onImageChange: (value: string) => void
  onStockChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onTagsChange: (value: string) => void
  onCancelEdit: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export default function ProductForm({
  name,
  price,
  image,
  stock,
  category,
  tags,
  editing,
  loading,
  onNameChange,
  onPriceChange,
  onImageChange,
  onStockChange,
  onCategoryChange,
  onTagsChange,
  onCancelEdit,
  onSubmit,
}: ProductFormProps) {
  return (
    <form className="product-form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="product-name">Nombre</label>
        <input
          id="product-name"
          type="text"
          placeholder="Nombre del producto"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="form-input"
        />
      </div>

      <div className="field">
        <label htmlFor="product-price">Precio</label>
        <input
          id="product-price"
          type="number"
          placeholder="0"
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          className="form-input"
        />
      </div>

      <div className="field">
        <label htmlFor="product-stock">Stock</label>
        <input
          id="product-stock"
          type="number"
          min="0"
          placeholder="0"
          value={stock}
          onChange={(event) => onStockChange(event.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="product-category">Categoría</label>
        <input
          id="product-category"
          type="text"
          placeholder="audio"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="product-tags">Etiquetas</label>
        <input
          id="product-tags"
          type="text"
          placeholder="casual, verano"
          value={tags}
          onChange={(event) => onTagsChange(event.target.value)}
          className="form-input"
        />
      </div>

      <div className="field">
        <label htmlFor="product-image">Imagen URL</label>
        <input
          id="product-image"
          type="text"
          placeholder="https://..."
          value={image}
          onChange={(event) => onImageChange(event.target.value)}
          className="form-input"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? '...' : editing ? 'Guardar' : 'Agregar'}
      </button>
      {editing && (
        <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
          Cancelar
        </button>
      )}
    </form>
  )
}
