import type { ShippingInfo } from '../types'

type ShippingFormProps = {
  shipping: ShippingInfo
  onChange: (field: keyof ShippingInfo, value: string) => void
  onSubmit: () => void
  onBack: () => void
}

export default function ShippingForm({ shipping, onChange, onSubmit, onBack }: ShippingFormProps) {
  return (
    <div style={{maxWidth: 600, margin: '0 auto'}}>
      <h2 style={{marginBottom: 24}}>Datos de Envío</h2>
      
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div>
          <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Dirección</label>
          <input
            type="text"
            value={shipping.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
          <div>
            <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Ciudad</label>
            <input
              type="text"
              value={shipping.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Código Postal</label>
            <input
              type="text"
              value={shipping.postalCode}
              onChange={(e) => onChange('postalCode', e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>
        
        <div>
          <label style={{display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 600}}>Teléfono</label>
          <input
            type="tel"
            value={shipping.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <div style={{display: 'flex', gap: 12, marginTop: 16}}>
          <button type="button" className="btn btn-secondary" onClick={onBack}>Volver</button>
          <button type="submit" className="btn btn-primary">Continuar a Revisión</button>
        </div>
      </form>
    </div>
  )
}
