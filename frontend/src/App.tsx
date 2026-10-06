import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import type { CartItem, Product, ShippingInfo } from './types'
import CartSidebar from './components/CartSidebar'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import ProductForm from './components/ProductForm'
import ProductsGrid from './components/ProductsGrid'
import CheckoutStepper from './components/CheckoutStepper'
import ShippingForm from './components/ShippingForm'
import OrderReview from './components/OrderReview'
import OrderConfirmation from './components/OrderConfirmation'
import ConfirmDialog from './components/ConfirmDialog'
import AdminDashboard from './components/AdminDashboard'
import OrderHistory from './components/OrderHistory'
import Spinner from './components/Spinner'
import ThemeToggle from './components/ThemeToggle'
import { useToast } from './context/ToastContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
axios.defaults.baseURL = API_URL

function App() {
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  ))

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [stock, setStock] = useState('0')
  const [category, setCategory] = useState('otros')
  const [tags, setTags] = useState('')
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [authIntent, setAuthIntent] = useState<'checkout' | 'orders' | null>(null)

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

    axios.get('/me')
      .then((userRes) => setUserRole(userRes.data.role || 'client'))
      .catch((err) => {
        console.error(err)
        if (err.response?.status === 401 || err.response?.status === 404) {
          handleLogout()
        }
        addToast('Error al cargar usuario', 'error')
      })
      .finally(() => setLoadingProducts(false))
  }, [token, addToast])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (categoryFilter) params.set('category', categoryFilter)
    if (tagFilter.trim()) params.set('tag', tagFilter.trim())
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    setLoadingProducts(true)
    axios.get(`/products${params.toString() ? `?${params.toString()}` : ''}`)
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.error(err)
        addToast('Error al cargar productos', 'error')
      })
      .finally(() => setLoadingProducts(false))
  }, [search, categoryFilter, tagFilter, minPrice, maxPrice, addToast])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch {
      // ignore
    }
  }, [cart])

  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingRegister, setLoadingRegister] = useState(false)
  const [loadingAddProduct, setLoadingAddProduct] = useState(false)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [shipping, setShipping] = useState<ShippingInfo>({ address: '', city: '', postalCode: '', phone: '' })
  const [currentOrder, setCurrentOrder] = useState<{ id: number; total: number } | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showOrders, setShowOrders] = useState(false)

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const activeFilterCount = [categoryFilter, tagFilter, minPrice, maxPrice].filter(Boolean).length

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoadingLogin(true)

    try {
      const res = await axios.post('/login', { email, password })
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUserRole(res.data.role || 'client')
      setPassword('')

      if (authIntent === 'checkout') {
        setCheckoutStep(2)
      } else if (authIntent === 'orders') {
        setShowOrders(true)
      }
      setAuthIntent(null)
      setShowAuth(false)
      setShowRegister(false)
    } catch (err: unknown) {
      console.error(err)
      addToast(axios.isAxiosError(err) ? err.response?.data || 'Error en login' : 'Error en login', 'error')
    } finally {
      setLoadingLogin(false)
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== confirmPassword) {
      addToast('Las contraseñas no coinciden', 'error')
      return
    }

    if (password.length < 6) {
      addToast('La contraseña debe tener al menos 6 caracteres', 'error')
      return
    }

    setLoadingRegister(true)

    try {
      await axios.post('/register', { email, password })
      setPassword('')
      setConfirmPassword('')
      setShowRegister(false)
      addToast('Cuenta creada. Ya puedes iniciar sesión', 'success')
    } catch (err: unknown) {
      console.error(err)
      addToast(axios.isAxiosError(err) ? err.response?.data || 'Error al crear la cuenta' : 'Error al crear la cuenta', 'error')
    } finally {
      setLoadingRegister(false)
    }
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || Number(price) <= 0 || !category.trim()) {
      addToast('Debes ingresar nombre, precio y categoría válidos', 'error')
      return
    }

    setLoadingAddProduct(true)

    try {
      const payload = {
        name: name.trim(),
        price: Number(price),
        image: image.trim() || undefined,
        stock: Number(stock),
        category: category.trim(),
        tags,
      }
      if (editingProduct) {
        await axios.put(`/products/${editingProduct}`, payload)
      } else {
        await axios.post('/products', payload)
      }

      setName('')
      setPrice('')
      setImage('')
      setStock('0')
      setCategory('otros')
      setTags('')
      setEditingProduct(null)

      const res = await axios.get('/products')
      setProducts(res.data)
      addToast(editingProduct ? 'Producto actualizado' : 'Producto agregado', 'success')
    } catch (err: unknown) {
      console.error(err)
      addToast(axios.isAxiosError(err) ? err.response?.data || 'Error al crear producto' : 'Error al crear producto', 'error')
    } finally {
      setLoadingAddProduct(false)
    }
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product.id)
    setName(product.name)
    setPrice(String(product.price))
    setImage(product.image || '')
    setStock(String(product.stock || 0))
    setCategory(product.category || 'otros')
    setTags(product.tags.join(', '))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditProduct() {
    setEditingProduct(null)
    setName('')
    setPrice('')
    setImage('')
    setStock('0')
    setCategory('otros')
    setTags('')
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
    const existingItem = cart.find((item) => item.id === product.id)
    const currentQuantity = existingItem?.quantity || 0

    if (!product.stock || currentQuantity >= product.stock) {
      addToast('No hay más stock disponible', 'error')
      return
    }

    setCart((currentCart) => {
      const itemInCart = currentCart.find((item) => item.id === product.id)

      if (itemInCart) {
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
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + delta,
                  products.find((product) => product.id === itemId)?.stock ?? item.quantity + delta
                ),
              }
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
    } catch (err: unknown) {
      console.error(err)
      addToast(axios.isAxiosError(err) ? err.response?.data?.error || 'Error en checkout' : 'Error en checkout', 'error')
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
    setShowOrders(false)
    setShowAuth(false)
    setAuthIntent(null)
    setCheckoutStep(1)
  }

  // El catalogo es publico; checkout e historial requieren sesion.
  function openAuth(intent: 'checkout' | 'orders' | null) {
    setAuthIntent(intent)
    setShowRegister(false)
    setShowAuth(true)
  }

  function requireAuth(intent: 'checkout' | 'orders'): boolean {
    if (token) {
      return true
    }
    openAuth(intent)
    return false
  }

  function closeAuth() {
    setShowAuth(false)
    setShowRegister(false)
    setAuthIntent(null)
  }

  function clearFilters() {
    setSearch('')
    setCategoryFilter('')
    setTagFilter('')
    setMinPrice('')
    setMaxPrice('')
  }

  const isAdmin = userRole === 'admin'

  if (showAuth) {
    if (showRegister) {
      return (
        <RegisterForm
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          loading={loadingRegister}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
          onBackToStore={closeAuth}
        />
      )
    }

    return (
      <LoginForm
        email={email}
        password={password}
        loading={loadingLogin}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        onRegister={() => setShowRegister(true)}
        onBackToStore={closeAuth}
      />
    )
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />
  }

  if (showOrders) {
    return <OrderHistory onBack={() => setShowOrders(false)} />
  }

  if (checkoutStep > 1) {
    return (
      <div>
        <header className="site-header">
          <div className="container header-wrapper">
            <a href="/" className="header-logo"><span className="header-logo__mark">N</span> Nicommerce</a>
            <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />
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
          <a href="/" className="header-logo"><span className="header-logo__mark">N</span> Nicommerce</a>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggleTheme={toggleTheme} />
            {isAdmin && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowAdmin(true)}
                style={{ fontSize: '0.875rem' }}
              >
                Panel Admin
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (requireAuth('orders')) {
                  setShowOrders(true)
                }
              }}
              type="button"
            >
              Mis órdenes
            </button>
            <span className="cart-count">{totalItems} {totalItems === 1 ? 'item' : 'items'} en carrito</span>
            {token ? (
              <button className="btn btn-secondary" onClick={handleLogout} type="button">
                Logout
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => openAuth(null)} type="button">
                Ingresar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="section-header">
            <div>
              <h1>{isAdmin ? 'Panel de Administración' : 'Productos'}</h1>
              <p className="section-description">
                {isAdmin
                  ? 'Gestiona tus productos e inventario'
                  : 'Explora el catálogo y encuentra lo que necesitas.'}
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
                stock={stock}
                category={category}
                tags={tags}
                editing={editingProduct !== null}
                onStockChange={setStock}
                onCategoryChange={setCategory}
                onTagsChange={setTags}
                onCancelEdit={cancelEditProduct}
                onSubmit={handleAddProduct}
            />
          )}

          <div className="catalog-toolbar">
            <input
              className="form-input"
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              className="btn btn-secondary filters-toggle"
              type="button"
              aria-expanded={showFilters}
              aria-controls="advanced-filters"
              onClick={() => setShowFilters((visible) => !visible)}
            >
              Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              <span aria-hidden="true">{showFilters ? '−' : '+'}</span>
            </button>
          </div>

          {showFilters && (
            <div className="product-filters" id="advanced-filters">
            <input
              className="form-input"
              type="text"
              placeholder="Categoría"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value.toLowerCase())}
            />
            <input
              className="form-input"
              type="text"
              placeholder="Etiqueta"
              value={tagFilter}
              onChange={(event) => setTagFilter(event.target.value.toLowerCase().replace(/^#/, ''))}
            />
            <input
              className="form-input"
              type="number"
              min="0"
              placeholder="Precio mínimo"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
            <input
              className="form-input"
              type="number"
              min="0"
              placeholder="Precio máximo"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
            <button className="btn btn-secondary" type="button" onClick={clearFilters}>Limpiar</button>
            </div>
          )}

          <div className="store-layout">
            <section>
              <ProductsGrid
                products={products}
                isAdmin={isAdmin}
                onAddToCart={handleAddToCart}
                onDeleteProduct={confirmDelete}
                onEditProduct={handleEditProduct}
              />
            </section>

            <CartSidebar
              cart={cart}
              totalItems={totalItems}
              total={total}
              loadingCheckout={loadingCheckout}
              onUpdateQuantity={updateCartItemQuantity}
              onRemoveItem={removeCartItem}
              onCheckout={() => {
                if (requireAuth('checkout')) {
                  setCheckoutStep(2)
                }
              }}
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
