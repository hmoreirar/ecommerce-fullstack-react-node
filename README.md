# Ecommerce Fullstack

App ecommerce con:
- React (frontend) - Diseño tipo Shopify
- Node.js + Express (backend) - PostgreSQL (DB)

## Features
- Auth (JWT)
- CRUD productos
- Carrito con persistencia localStorage
- **Checkout multi-step**: Carrito → Envío → Revisión → Confirmación
- Procesamiento real de órdenes en PostgreSQL
- Dark/Light mode desactivado temporalmente

## Cómo correr

### 1. Base de datos (PostgreSQL)
```bash
# Ejecutar migración (usa pgAdmin o psql)
psql -U postgres -d ecommerce -f backend/migrations.sql
# Password: jajaja123
```

### 2. Backend:
```bash
cd backend
npm run dev
# Servidor en http://localhost:3000
```

### 3. Frontend:
```bash
cd frontend
npm run dev
# App en http://localhost:5173
```

## Flujo de Compra

1. **Registro/Login** → Usa test@test.com / 123456 (ya creado)
2. **Agregar productos** → Formulario en la página principal
3. **Carrito** → Sidebar derecho, botón "Finalizar Compra"
4. **Envío** → Formulario: dirección, ciudad, código postal, teléfono
5. **Revisión** → Resumen de items + envío + total
6. **Confirmación** → ¡Orden creada! Número de orden generado

## Endpoints Backend

- `POST /register` - Registro de usuario
- `POST /login` - Login (devuelve JWT)
- `GET /products` - Listar productos (requiere auth)
- `POST /products` - Crear producto (requiere auth)
- `DELETE /products/:id` - Eliminar producto (requiere auth)
- `POST /checkout` - Procesar orden (requiere auth)
  - Body: `{ cart: [...], shipping: { address, city, postalCode, phone } }`
  - Valida stock, crea orden, descuenta inventario (transacción SQL)
- `GET /orders` - Historial de órdenes del usuario (requiere auth)

## Base de Datos

Tablas:
- `users` - Usuarios (id, email, password)
- `products` - Productos (id, name, price, image, stock)
- `orders` - Órdenes (id, user_id, total, status, shipping_address, etc.)
- `order_items` - Items de cada orden (id, order_id, product_id, quantity, price)

## Credenciales de prueba

- **Email**: test@test.com
- **Password**: 123456
- **DB Password**: jajaja123
