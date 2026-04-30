import { useState, useEffect } from 'react'
import type { User, Order } from '../types'
import { currencyFormatter } from '../utils'

type AdminDashboardProps = {
  onBack: () => void
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'orders'>('orders')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        fetch('/admin/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}),
        fetch('/admin/orders', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
      ])
      
      if (usersRes.ok) setUsers(await usersRes.json())
      if (ordersRes.ok) setOrders(await ordersRes.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: number, status: string) {
    try {
      await fetch(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      })
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  async function updateUserRole(userId: number, role: string) {
    try {
      await fetch(`/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role })
      })
      loadData()
    } catch (err) {
      console.error(err)
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
                        {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            style={{
                              padding: '6px 12px',
                              border: order.status === status ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                              borderRadius: 4,
                              background: order.status === status ? 'var(--color-accent)' : 'transparent',
                              color: order.status === status ? '#fff' : 'var(--color-foreground)',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
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
