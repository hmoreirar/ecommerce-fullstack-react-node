# Nicommerce

Ecommerce fullstack orientado a una experiencia de compra clara y realista: autenticación, catálogo administrable, carrito persistente y checkout transaccional con PostgreSQL.

## Stack

- React 19 + TypeScript + Vite
- Node.js + Express 5
- PostgreSQL
- JWT + bcrypt
- Axios

## Funcionalidades

## Features
- Auth (JWT)
- CRUD productos
- Carrito con persistencia localStorage
- **Checkout multi-step**: Carrito → Envío → Revisión → Confirmación
- Procesamiento real de órdenes en PostgreSQL
- Modo claro/oscuro persistente
- Filtros por búsqueda, categoría, etiquetas y precio
- Panel de administración para productos, usuarios y órdenes
- Historial y detalle de órdenes
- Validación de stock dentro de una transacción SQL

## Cómo correr

### 1. Base de datos (PostgreSQL)
```bash
# Ejecutar la migración desde la base de datos creada
psql -U postgres -d ecommerce -f backend/migrations.sql
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

## Configuración

1. Copia `backend/.env.example` a `backend/.env`.
2. Completa las credenciales de PostgreSQL y un `JWT_SECRET` largo y aleatorio.
3. Ejecuta la migración.

Variables principales:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ecommerce
DB_PASSWORD=tu_password_local
DB_PORT=5432
JWT_SECRET=un_secreto_largo_y_aleatorio
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Flujo de compra

1. **Registro/Login** → Crea una cuenta desde la pantalla de registro
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
- `GET /orders/:id` - Detalle de una orden propia (requiere auth)

## Base de Datos

Tablas:
- `users` - Usuarios (id, email, password)
- `products` - Productos (id, name, price, image, stock)
- Los productos se desactivan mediante `active` en lugar de borrarse físicamente.
- `orders` - Órdenes (id, user_id, total, status, shipping_address, etc.)
- `order_items` - Items de cada orden (id, order_id, product_id, quantity, price)

## Pruebas manuales

Con el backend activo, puedes ejecutar el flujo completo usando credenciales definidas en tu entorno:

```bash
TEST_EMAIL=tu_correo TEST_PASSWORD=tu_password ./test-flow.sh
```

## Estado del proyecto

Este proyecto está preparado como pieza de portafolio. El checkout no procesa pagos reales; crea órdenes y actualiza inventario dentro de PostgreSQL. Una siguiente iteración podría integrar un proveedor de pagos y despliegue automatizado.
