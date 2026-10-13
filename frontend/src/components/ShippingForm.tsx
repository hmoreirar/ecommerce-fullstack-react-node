import type { ShippingInfo } from '../types'

type ShippingFormProps = {
  shipping: ShippingInfo
  onChange: (field: keyof ShippingInfo, value: string) => void
  onSubmit: () => void
  onBack: () => void
}

export default function ShippingForm({ shipping, onChange, onSubmit, onBack }: ShippingFormProps) {
  return (
    <div className="checkout-panel">
      <h2>Datos de Envío</h2>

      <form
        className="checkout-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="field">
          <label htmlFor="shipping-address">Dirección</label>
          <input
            id="shipping-address"
            type="text"
            value={shipping.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="shipping-fields">
          <div className="field">
            <label htmlFor="shipping-city">Ciudad</label>
            <input
              id="shipping-city"
              type="text"
              value={shipping.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="shipping-postal">Código Postal</label>
            <input
              id="shipping-postal"
              type="text"
              value={shipping.postalCode}
              onChange={(e) => onChange('postalCode', e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="shipping-phone">Teléfono</label>
          <input
            id="shipping-phone"
            type="tel"
            value={shipping.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>Volver</button>
          <button type="submit" className="btn btn-primary">Continuar a Revisión</button>
        </div>
      </form>
    </div>
  )
}
