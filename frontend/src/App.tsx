import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import type { CartItem, Product, ShippingInfo } from './types'
import CartSidebar from './components/CartSidebar'
import LoginForm from './components/LoginForm'
import ProductForm from './components/ProductForm'
import ProductsGrid from './components/ProductsGrid'
import CheckoutStepper from './components/CheckoutStepper'
import ShippingForm from './components/ShippingForm'
import OrderReview from './components/OrderReview'
import OrderConfirmation from './components/OrderConfirmation'
import ConfirmDialog from './components/ConfirmDialog'
import AdminDashboard from './components/AdminDashboard'
import Spinner from './components/Spinner'
import { useToast } from './context/ToastContext'

const API_URL = 'http://localhost:3000'
axios.defaults.baseURL = API_URL

function App() {
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null)
  const [theme] = useState<'light' | 'dark'>('light')

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (!token) {
      delete axios.defaults.headers.common.Authorization
      return
    }

    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    setLoadingProducts(true)

    axios.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err)
        addToast('Error al cargar productos', 'error')
      })
      .finally(() => setLoadingProducts(false))
  }, [token, addToast])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart])

  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingAddProduct, setLoadingAddProduct] = useState(false)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [shipping, setShipping] = useState<ShippingInfo>({ address: '', city: '', postalCode: '', phone: '' })
  const [currentOrder, setCurrentOrder] = useState<{ id: number; total: number } | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoadingLogin(true)

    try {
      const res = await axios.post('/login', { email, password })
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUserRole(res.data.role || 'client')
    } catch (err: any) {
      console.error(err)
      addToast(err.response?.data || 'Error en login', 'error')
    } finally {
      setLoadingLogin(false)
    }
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || Number(price) <= 0) {
      addToast('Debes ingresar un nombre y un precio válido', 'error')
      return
    }

    setLoadingAddProduct(true)

    try {
      await axios.post('/products', {
        name: name.trim(),
        price: Number(price),
        image: image.trim() || undefined,
      })

      setName('')
      setPrice('')
      setImage('')

      const res = await axios.get('/products')
      setProducts(res.data)
      addToast('Producto agregado', 'success')
    } catch (err: any) {
      console.error(err)
      addToast(err.response?.data || 'Error al crear producto', 'error')
    } finally {
      setLoadingAddProduct(false)
    }
  }

  async function handleDeleteProduct(productId: number) {
    try {
      await axios.delete(`/products/${productId}`)
      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
      setCart((currentCart) => currentCart.filter((item) => item.id !== productId))
      addToast('Producto eliminado', 'success')
    } catch (err) {
      console.error(err)
      addToast('Error al eliminar producto', 'error')
    } finally {
      setDeleteConfirm(null)
    }
  }

  function confirmDelete(productId: number) {
    setDeleteConfirm(productId)
  }

  function handleAddToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  function updateCartItemQuantity(itemId: number, delta: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeCartItem(itemId: number) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId))
  }

  function handleShippingChange(field: keyof ShippingInfo, value: string) {
    setShipping(prev => ({ ...prev, [field]: value }))
  }

  function handleCheckoutReview() {
    setCheckoutStep(3)
  }

  async function handleCheckoutConfirm() {
    setLoadingCheckout(true)
    try {
      const res = await axios.post('/checkout', { cart, shipping })
      setCurrentOrder({ id: res.data.orderId, total: res.data.total })
      setCheckoutStep(4)
      setCart([])
      addToast('Compra realizada 🎉', 'success')
    } catch (err: any) {
      console.error(err)
      addToast(err.response?.data?.error || 'Error en checkout', 'error')
    } finally {
      setLoadingCheckout(false)
    }
  }

  function handleContinueShopping() {
    setCheckoutStep(1)
    setCurrentOrder(null)
    setShipping({ address: '', city: '', postalCode: '', phone: '' })
  }

  function handleLogout() {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common.Authorization
    setToken('')
    setUserRole(null)
    setShowAdmin(false)
  }

  const isAdmin = userRole === 'admin'

  if (!token) {
    return (
      <LoginForm
        email={email}
        password={password}
        loading={loadingLogin}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    )
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />
  }

  if (checkoutStep > 1) {
    return (
      <div>
        <header className="site-header">
          <div className="container header-wrapper">
            <a href="/" className="header-logo">Nicommerce</a>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <CheckoutStepper currentStep={checkoutStep} />

            {checkoutStep === 2 && (
              <ShippingForm
                shipping={shipping}
                onChange={handleShippingChange}
                onSubmit={handleCheckoutReview}
                onBack={() => setCheckoutStep(1)}
              />
            )}

            {checkoutStep === 3 && (
              <OrderReview
                cart={cart}
                shipping={shipping}
                total={total}
                onConfirm={handleCheckoutConfirm}
                onBack={() => setCheckoutStep(2)}
                loading={loadingCheckout}
              />
            )}

            {checkoutStep === 4 && currentOrder && (
              <OrderConfirmation
                orderId={currentOrder.id}
                total={currentOrder.total}
                onContinue={handleContinueShopping}
              />
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      {loadingProducts && <div className="loading-container"><Spinner size="lg" /></div>}

      <header className="site-header">
        <div className="container header-wrapper">
          <a href="/" className="header-logo">Nicommerce</a>
          <div className="header-actions">
            {isAdmin && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowAdmin(true)}
                style={{ fontSize: '0.875rem' }}
              >
                Panel Admin
              </button>
            )}
            <span style={{ color: 'var(--color-foreground-light)', fontSize: '0.9rem' }}>
              {totalItems} items en carrito
            </span>
            <button className="btn btn-secondary" onClick={handleLogout} type="button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="section-header">
            <div>
              <h1>{isAdmin ? 'Panel de Administración' : 'Catálogo de Productos'}</h1>
              <p style={{ color: 'var(--color-foreground-light)', marginTop: '4px' }}>
                {isAdmin
                  ? 'Gestiona tus productos e inventario'
                  : 'Descubre nuestra selección de productos'}
              </p>
            </div>
            <span className="badge">{products.length} productos</span>
          </div>

          {isAdmin && (
            <ProductForm
              name={name}
              price={price}
              image={image}
              loading={loadingAddProduct}
              onNameChange={setName}
              onPriceChange={setPrice}
              onImageChange={setImage}
              onSubmit={handleAddProduct}
            />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
            <section>
              <ProductsGrid
                products={products}
                isAdmin={isAdmin}
                onAddToCart={handleAddToCart}
                onDeleteProduct={confirmDelete}
              />
            </section>

            <CartSidebar
              cart={cart}
              totalItems={totalItems}
              total={total}
              loadingCheckout={loadingCheckout}
              onUpdateQuantity={updateCartItemQuantity}
              onRemoveItem={removeCartItem}
              onCheckout={() => setCheckoutStep(2)}
            />
          </div>

          {isAdmin && (
            <ConfirmDialog
              open={deleteConfirm !== null}
              title="Eliminar producto"
              message="¿Estás seguro de eliminar este producto?"
              onConfirm={() => handleDeleteProduct(deleteConfirm!)}
              onCancel={() => setDeleteConfirm(null)}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
