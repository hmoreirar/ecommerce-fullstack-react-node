import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import type { User, Order } from '../types'
import { currencyFormatter, allowedOrderTransitions } from '../utils'
import { useToast } from '../context/ToastContext'

type AdminDashboardProps = {
  onBack: () => void
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'orders'>('orders')
  const { addToast } = useToast()

  const loadData = useCallback(async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/orders'),
      ])

      setUsers(usersRes.data)
      setOrders(ordersRes.data)
    } catch (err) {
      console.error(err)
      addToast('Error al cargar datos de administración', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function updateOrderStatus(orderId: number, status: string) {
    try {
      await axios.put(`/admin/orders/${orderId}/status`, { status })
      addToast(`Orden #${orderId} actualizada a ${status}`, 'success')
      loadData()
    } catch (err) {
      console.error(err)
      const message = axios.isAxiosError(err) && typeof err.response?.data === 'string'
        ? err.response.data
        : 'Error al actualizar la orden'
      addToast(message, 'error')
    }
  }

  async function updateUserRole(userId: number, role: string) {
    try {
      await axios.put(`/admin/users/${userId}/role`, { role })
      addToast('Rol actualizado', 'success')
      loadData()
    } catch (err) {
      console.error(err)
      const message = axios.isAxiosError(err) && typeof err.response?.data === 'string'
        ? err.response.data
        : 'Error al actualizar el rol'
      addToast(message, 'error')
    }
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <h1>Panel de Administración</h1>
        <button className="btn btn-secondary" onClick={onBack}>Volver a Tienda</button>
      </div>

      <div style={{display: 'flex', gap: 12, marginBottom: 24}}>
        <button
          className="btn"
          style={{
            background: activeTab === 'orders' ? 'var(--color-accent)' : 'var(--color-surface)',
            color: activeTab === 'orders' ? '#fff' : 'var(--color-foreground)'
          }}
          onClick={() => setActiveTab('orders')}
        >
          Órdenes ({orders.length})
        </button>
        <button
          className="btn"
          style={{
            background: activeTab === 'users' ? 'var(--color-accent)' : 'var(--color-surface)',
            color: activeTab === 'users' ? '#fff' : 'var(--color-foreground)'
          }}
          onClick={() => setActiveTab('users')}
        >
          Usuarios ({users.length})
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: 60}}>Cargando...</div>
      ) : (
        <>
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <p style={{color: 'var(--color-foreground-light)'}}>No hay órdenes aún</p>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  {orders.map((order) => (
                    <div key={order.id} style={{padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                        <div>
                          <strong>Orden #{order.id}</strong>
                          <p style={{fontSize: '0.875rem', color: 'var(--color-foreground-light)'}}>
                            {order.email} • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: 20,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: order.status === 'pending' ? '#fff3cd' : 
                                       order.status === 'shipped' ? '#d1ecf1' :
                                       order.status === 'delivered' ? '#d4edda' : '#f8d7da',
                            color: order.status === 'pending' ? '#856404' :
                                     order.status === 'shipped' ? '#0c5460' :
                                     order.status === 'delivered' ? '#155724' : '#721c24'
                          }}>
                            {order.status}
                          </span>
                          <span style={{fontWeight: 700, color: 'var(--color-accent)'}}>
                            {currencyFormatter.format(order.total)}
                          </span>
                        </div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        {['pending', 'paid', 'shipped', 'delivered', 'cancelled']
                          .filter((status) => status === order.status || (allowedOrderTransitions[order.status] ?? []).includes(status))
                          .map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            disabled={order.status === status}
                            style={{
                              padding: '6px 12px',
                              border: order.status === status ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                              borderRadius: 4,
                              background: order.status === status ? 'var(--color-accent)' : 'transparent',
                              color: order.status === status ? '#fff' : 'var(--color-foreground)',
                              fontSize: '0.8rem',
                              cursor: order.status === status ? 'not-allowed' : 'pointer',
                              opacity: order.status === status ? 0.7 : 1
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              {users.length === 0 ? (
                <p style={{color: 'var(--color-foreground-light)'}}>No hay usuarios</p>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  {users.map((user) => (
                    <div key={user.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, border: '1px solid var(--color-border)', borderRadius: 8}}>
                      <div>
                        <strong>{user.email}</strong>
                        <span style={{
                          marginLeft: 8,
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: '0.75rem',
                          background: user.role === 'admin' ? 'var(--color-accent)' : 'var(--color-surface)',
                          color: user.role === 'admin' ? '#fff' : 'var(--color-foreground)'
                        }}>
                          {user.role}
                        </span>
                      </div>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        style={{padding: 6, borderRadius: 4, border: '1px solid var(--color-border)'}}
                      >
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
