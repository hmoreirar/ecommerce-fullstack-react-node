import { useEffect, useState } from 'react'
import axios from 'axios'

type Product = {
  id: number
  name: string
  price: number
  image?: string

}

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

function App() {
  // AUTH
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  // PRODUCTS
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  // CART
  const [cart, setCart] = useState<CartItem[]>([])

  // LOAD PRODUCTS
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3000/products')
        .then(res => setProducts(res.data))
        .catch(err => console.error(err))
    }
  }, [token])

  // TOTAL
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  // LOGIN VIEW
  if (!token) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Login 🔐</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault()

            try {
              const res = await axios.post('http://localhost:3000/login', {
                email,
                password
              })

              localStorage.setItem('token', res.data.token)
              setToken(res.data.token)

            } catch (err) {
              console.error(err)
              alert('Error en login')
            }
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  // APP
  return (
    <div style={{ padding: '20px' }}>
      <h1>Mi tienda 🚀</h1>

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.removeItem('token')
          setToken('')
        }}
      >
        Logout
      </button>

      {/* FORM PRODUCTO */}
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          try {
            await axios.post('http://localhost:3000/products', {
              name,
              price: Number(price),
              image
            })

            setName('')
            setPrice('')
            setImage('')

            const res = await axios.get('http://localhost:3000/products')
            setProducts(res.data)

          } catch (err) {
            console.error(err)
          }
        }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
  type="text"
  placeholder="URL imagen"
  value={image}
  onChange={(e) => setImage(e.target.value)}
/>
        <button type="submit">Agregar</button>
      </form>

      {/* PRODUCTOS */}
      <h2>Productos</h2>

      {products.map(product => (
        <div
          key={product.id}
          style={{
            border: '1px solid #ccc',
            margin: '10px',
            padding: '10px'
          }}
        >
          <img
  src={product.image}
  alt={product.name}
  width="150"
/>
          <h3>{product.name}</h3>
          <p>${product.price}</p>

          {/* AGREGAR AL CARRITO */}
          <button
            onClick={() => {
              const existing = cart.find(item => item.id === product.id)

              if (existing) {
                setCart(cart.map(item =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ))
              } else {
                setCart([...cart, { ...product, quantity: 1 }])
              }
            }}
          >
            Agregar al carrito 🛒
          </button>

          {/* ELIMINAR PRODUCTO */}
          <button
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:3000/products/${product.id}`)
                setProducts(products.filter(p => p.id !== product.id))
              } catch (err) {
                console.error(err)
              }
            }}
          >
            Eliminar ❌
          </button>
        </div>
      ))}

      {/* CARRITO */}
      <h2>Carrito 🛒</h2>

      {cart.length === 0 && <p>Carrito vacío</p>}

      {cart.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price} x {item.quantity}

          <button
            onClick={() => {
              setCart(cart.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ))
            }}
          >
            +
          </button>

          <button
            onClick={() => {
              setCart(cart
                .map(i =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity - 1 }
                    : i
                )
                .filter(i => i.quantity > 0)
              )
            }}
          >
            -
          </button>

          <button
            onClick={() => {
              setCart(cart.filter(i => i.id !== item.id))
            }}
          >
            Eliminar ❌
          </button>
        </div>
      ))}

      {/* TOTAL */}
      <h3>Total: ${total}</h3>  
    <button
  onClick={async () => {
    try {
      await axios.post('http://localhost:3000/checkout', {
        cart
      })

      alert('Compra realizada 🎉')

      // limpiar carrito
      setCart([])

    } catch (err) {
      console.error(err)
    }
  }}
>
  Comprar 💳
</button>  
    </div>
    
  )
}

export default App
