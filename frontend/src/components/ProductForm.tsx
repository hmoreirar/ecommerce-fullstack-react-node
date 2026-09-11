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
    <form className="product-form" onSubmit={onSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 140px 120px 1fr 150px 1fr auto auto', gap: 12, marginBottom: 24, alignItems: 'end'}}>
      <div>
        <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Stock</label>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={stock}
          onChange={(event) => onStockChange(event.target.value)}
          className="form-input"
          required
        />
      </div>

      <div>
        <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Categoría</label>
        <input
          type="text"
          placeholder="camisetas"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="form-input"
          required
        />
      </div>

      <div>
        <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Etiquetas</label>
        <input
          type="text"
          placeholder="casual, verano"
          value={tags}
          onChange={(event) => onTagsChange(event.target.value)}
          className="form-input"
        />
      </div>

      <div>
        <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Nombre</label>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="form-input"
        />
      </div>

      <div>
        <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Precio</label>
        <input
          type="number"
          placeholder="0"
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          className="form-input"
        />
      </div>

      <div>
        <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Imagen URL</label>
        <input
          type="text"
          placeholder="https://..."
          value={image}
          onChange={(event) => onImageChange(event.target.value)}
          className="form-input"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading} style={{height: 42}}>
        {loading ? '...' : editing ? 'Guardar' : 'Agregar'}
      </button>
      {editing && <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>Cancelar</button>}
    </form>
  )
}
