import { currencyFormatter } from '../utils'

type OrderConfirmationProps = {
  orderId: number
  total: number
  onContinue: () => void
}

export default function OrderConfirmation({ orderId, total, onContinue }: OrderConfirmationProps) {
  return (
    <div style={{textAlign: 'center', padding: 60, maxWidth: 500, margin: '0 auto'}}>
      <div style={{fontSize: '3rem', marginBottom: 16}}>🎉</div>
      <h2 style={{marginBottom: 8}}>¡Compra Realizada!</h2>
      <p style={{color: 'var(--color-foreground-light)', marginBottom: 24}}>
        Tu orden #{orderId} ha sido creada exitosamente.
      </p>
      <p style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 32}}>
        Total: {currencyFormatter.format(total)}
      </p>
      <button className="btn btn-primary" onClick={onContinue} style={{minWidth: 200}}>
        Seguir Comprando
      </button>
    </div>
  )
}
