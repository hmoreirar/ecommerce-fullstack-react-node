import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Order } from '../types'
import { currencyFormatter } from '../utils'

type OrderHistoryProps = {
  onBack: () => void
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagada',
  shipped: 'Enviada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
}

export default function OrderHistory({ onBack }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    axios.get('/orders')
      .then((response) => setOrders(response.data))
      .finally(() => setLoading(false))
  }, [])

  async function showOrderDetail(orderId: number) {
    setLoadingDetail(true)
    try {
      const response = await axios.get(`/orders/${orderId}`)
      setSelectedOrder(response.data)
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <main className="main-content">
      <div className="container order-history">
        <div className="section-header">
          <div>
            <h1>Mis órdenes</h1>
            <p style={{ color: 'var(--color-foreground-light)' }}>Consulta el estado de tus compras.</p>
          </div>
          <button className="btn btn-secondary" onClick={onBack} type="button">Volver a la tienda</button>
        </div>

        {loading ? <p>Cargando órdenes...</p> : orders.length === 0 ? (
          <p style={{ color: 'var(--color-foreground-light)' }}>Todavía no tienes órdenes.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div>
                  <strong>Orden #{order.id}</strong>
                  <p style={{ color: 'var(--color-foreground-light)' }}>
                    {new Date(order.created_at).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <span className="badge">{statusLabels[order.status] || order.status}</span>
                <strong>{currencyFormatter.format(order.total)}</strong>
                <button className="btn btn-secondary" onClick={() => showOrderDetail(order.id)} type="button">
                  Ver detalle
                </button>
              </article>
            ))}
          </div>
        )}

        {loadingDetail && <p style={{ marginTop: 24 }}>Cargando detalle...</p>}
        {selectedOrder && (
          <section className="order-detail">
            <div className="section-header">
              <h2>Orden #{selectedOrder.id}</h2>
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)} type="button">Cerrar</button>
            </div>
            {selectedOrder.items?.map((item) => (
              <div className="order-detail__item" key={item.product_id}>
                <span>{item.name || 'Producto no disponible'} x {item.quantity}</span>
                <strong>{currencyFormatter.format(item.price * item.quantity)}</strong>
              </div>
            ))}
            <div className="order-detail__total">
              <span>Total</span>
              <strong>{currencyFormatter.format(selectedOrder.total)}</strong>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
