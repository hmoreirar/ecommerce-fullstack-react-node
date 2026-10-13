import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import type { User, Order } from '../types'
import { currencyFormatter, allowedOrderTransitions } from '../utils'
import { useToast } from '../context/ToastContext'

type AdminDashboardProps = {
  onBack: () => void
}

const allStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

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
      <div className="section-header">
        <div>
          <h1>Panel de Administración</h1>
          <p className="section-description">Gestiona órdenes, usuarios y roles.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Volver a Tienda
        </button>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          Órdenes ({orders.length})
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          Usuarios ({users.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-container">Cargando...</div>
      ) : (
        <>
          {activeTab === 'orders' && (
            <div className="admin-list">
              {orders.length === 0 ? (
                <p className="section-description">No hay órdenes aún.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="admin-order-block">
                    <div className="admin-row">
                      <div className="admin-row__main">
                        <strong>Orden #{order.id}</strong>
                        <span className="admin-row__meta">
                          {order.email} · {new Date(order.created_at).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <div className="admin-row__side">
                        <span className={`status-pill ${order.status === 'delivered' ? 'status-pill--filled' : ''}`}>
                          {order.status}
                        </span>
                        <span className="order-card__total">
                          {currencyFormatter.format(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="admin-status-actions">
                      {allStatuses
                        .filter((status) => status === order.status || (allowedOrderTransitions[order.status] ?? []).includes(status))
                        .map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`btn ${status === order.status ? 'btn-primary' : 'btn-secondary'}`}
                            disabled={status === order.status}
                            onClick={() => updateOrderStatus(order.id, status)}
                          >
                            {status}
                          </button>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-list">
              {users.length === 0 ? (
                <p className="section-description">No hay usuarios.</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="admin-row">
                    <div className="admin-row__main">
                      <div>
                        <strong>{user.email}</strong>
                        <span className={`role-pill ${user.role === 'admin' ? 'role-pill--admin' : ''}`}>
                          {user.role}
                        </span>
                      </div>
                      <span className="admin-row__meta">
                        id {user.id}
                      </span>
                    </div>
                    <div className="admin-row__side">
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        aria-label={`Rol de ${user.email}`}
                      >
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
