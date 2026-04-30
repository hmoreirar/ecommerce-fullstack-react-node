import type { FormEvent } from 'react'

type ProductFormProps = {
  name: string
  price: string
  image: string
  loading?: boolean
  onNameChange: (value: string) => void
  onPriceChange: (value: string) => void
  onImageChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export default function ProductForm({
  name,
  price,
  image,
  loading,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSubmit,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 120px 1fr auto', gap: 12, marginBottom: 24, alignItems: 'end'}}>
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
        {loading ? '...' : 'Agregar'}
      </button>
    </form>
  )
}
