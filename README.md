# Nicommerce

Nicommerce es un ecommerce fullstack orientado a una experiencia de compra clara y realista: autenticacion, catalogo administrable, carrito persistente y checkout transaccional con PostgreSQL.

## Demo

> El checkout crea ordenes y actualiza inventario, pero no procesa pagos reales.

### Capturas

Las capturas se organizan en `docs/screenshots/`. Agrega imagenes con estos nombres cuando las generes desde la aplicacion local:

| Vista | Archivo |
| --- | --- |
| Catalogo | `docs/screenshots/catalog.png` |
| Carrito | `docs/screenshots/cart.png` |
| Checkout | `docs/screenshots/checkout.png` |
| Confirmacion | `docs/screenshots/order-confirmation.png` |
| Administracion | `docs/screenshots/admin.png` |

El repositorio incluye la estructura de la demo y no publica credenciales ni una URL de despliegue ficticia.

## Stack

- React 19, TypeScript y Vite
- Node.js y Express 5
- PostgreSQL
- JWT y bcrypt
- Axios

## Funcionalidades

- Registro y autenticacion con JWT
- Catalogo publico (sin sesion) con busqueda, categorias, etiquetas y rango de precios
- Login requerido para comprar, ver el historial de ordenes y administrar
- Carrito persistido en `localStorage`
- Checkout multi-step: carrito, envio, revision y confirmacion
- Creacion de ordenes e inventario transaccional en PostgreSQL
- Panel de administracion para productos, usuarios y ordenes
- Historial y detalle de ordenes
- Modo claro/oscuro persistente
- Rate limiting, Helmet y validaciones de backend

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- `psql` disponible en el PATH

## Instalacion local

### 1. Crear la base de datos

```bash
createdb ecommerce
psql -U postgres -d ecommerce -f backend/migrations.sql
psql -U postgres -d ecommerce -f backend/seed.sql
```

Si la base de datos ya existe, omite `createdb`.

### 2. Configurar el backend

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus valores locales. Nunca subas ese archivo a GitHub. Genera un secreto JWT seguro con:

```bash
openssl rand -base64 32
```

Variables disponibles:

| Variable | Uso |
| --- | --- |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_HOST` | Host de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_PASSWORD` | Contrasena local de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL |
| `DATABASE_URL` | Connection string de PostgreSQL (opcional). Si existe, prima sobre las variables `DB_*` y se usa SSL salvo que sea localhost |
| `JWT_SECRET` | Secreto para firmar tokens, minimo 32 caracteres |
| `PORT` | Puerto de la API |
| `FRONTEND_URL` | Origen permitido por CORS |

### 3. Instalar y ejecutar

En una terminal:

```bash
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Datos de prueba

`backend/seed.sql` agrega productos de demostracion y puede ejecutarse varias veces sin duplicarlos.

Los usuarios se crean desde la pantalla de registro o mediante la API:

```bash
curl -X POST http://localhost:3000/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","password":"demo-password-123"}'
```

Para probar el panel administrativo, cambia el rol de un usuario local:

```sql
UPDATE users SET role = 'admin' WHERE email = 'demo@example.com';
```

El cambio de rol debe hacerse solo en entornos locales o de demostracion.

## Arquitectura del checkout

### Frontend

1. El usuario agrega productos al carrito; el estado se persiste en `localStorage`.
2. `ShippingForm` recopila direccion, ciudad, codigo postal y telefono.
3. `OrderReview` muestra los items y los datos de envio antes de confirmar.
4. La confirmacion envia `cart` y `shipping` a `POST /checkout`.
5. La respuesta devuelve el identificador y total de la orden; el carrito se limpia y se muestra la confirmacion.

### Backend y PostgreSQL

1. `authMiddleware` valida el JWT y obtiene el usuario autenticado.
2. La ruta valida que el carrito no este vacio, que no haya duplicados y que el envio sea valido.
3. Se abre una transaccion con `BEGIN`.
4. Cada producto se consulta con `SELECT ... FOR UPDATE`, bloqueando sus filas durante la operacion.
5. El backend comprueba el stock y calcula el total usando los precios de PostgreSQL, no los enviados por el cliente.
6. Se insertan la orden en `orders` y sus items en `order_items`.
7. Se descuenta el stock y se ejecuta `COMMIT`.
8. Cualquier error ejecuta `ROLLBACK`, evitando ordenes parciales o inventario inconsistente.

El sistema no integra un proveedor de pagos: la confirmacion representa una orden creada correctamente, no un cobro real.

## Prueba automatizada del flujo

Con el backend activo y un usuario existente:

```bash
TEST_EMAIL=demo@example.com TEST_PASSWORD=demo-password-123 ./test-flow.sh
```

El script hace login, obtiene un producto y ejecuta un checkout completo.

## Endpoints principales

- `POST /register` - Registro de usuario
- `POST /login` - Login y JWT
- `GET /products` - Catalogo
- `POST /products` - Crear producto, solo admin
- `PUT /products/:id` - Editar producto, solo admin
- `DELETE /products/:id` - Desactivar producto, solo admin
- `POST /checkout` - Crear una orden autenticada
- `GET /orders` - Historial del usuario autenticado
- `GET /orders/:id` - Detalle de una orden propia
- `GET /admin/orders` - Gestion de ordenes, solo admin
- `GET /admin/users` - Gestion de usuarios, solo admin

## Estructura

```text
backend/
  index.js          API Express y reglas de negocio
  db.js             Pool de PostgreSQL
  migrations.sql    Tablas e indices
  seed.sql          Datos de demostracion
frontend/
  src/App.tsx       Estado principal y flujo de checkout
  src/components/   Catalogo, carrito, checkout y administracion
docs/screenshots/   Capturas opcionales para la demo
test-flow.sh        Prueba manual automatizada del checkout
```

## Seguridad

- `backend/.env` contiene secretos locales y esta excluido por `.gitignore`.
- Si una credencial fue publicada anteriormente, debe revocarse y regenerarse aunque ya se haya eliminado del archivo.
- El checkout valida stock y calcula precios en el servidor.

## Despliegue (Render + Vercel)

El repositorio incluye `render.yaml` (API + PostgreSQL) y funciona con subdominios de plataforma (sin dominio propio).

### 1. API y base de datos (Render)

1. Sube el repositorio a GitHub.
2. En Render: **New > Blueprint** y selecciona el repositorio. Se crean el servicio `nicommerce-api` y la base `nicommerce-db`.
3. El comando `releaseCommand` (`npm run migrate`) aplica `migrations.sql` en cada deploy; es idempotente.
4. Variables configuradas por el blueprint: `JWT_SECRET` (generado por Render), `DATABASE_URL`, `NODE_ENV`, `FRONTEND_URL`.

Alternativa con plan gratuito de base de datos: crea una base en Neon y reemplaza `DATABASE_URL` por su connection string (el backend activa SSL automaticamente cuando detecta `DATABASE_URL` no local).

Nota: en el plan gratuito de Render el servicio se suspende por inactividad y el primer request tarda 30-60 segundos. Ademas, las bases de datos gratuitas de Render se eliminan automaticamente a los 90 dias: para una demo duradera usa el plan `basic` o una base externa como Neon.

### 2. Frontend (Vercel)

1. En Vercel: **Import** del repositorio, root directory `frontend/`.
2. Framework preset: Vite. Build `npm run build`, output `dist`.
3. Variable de entorno `VITE_API_URL` = URL de la API (por ejemplo `https://nicommerce-api.onrender.com`). Se congela en el bundle: al cambiarla hay que redeployar.
4. Copia la URL de Vercel en la variable `FRONTEND_URL` del servicio en Render (define el origen permitido por CORS) y guarda.

### 3. Datos y administrador

```bash
# Datos de demostracion (opcional, una vez): Render Shell o local con DATABASE_URL
npm run seed

# Otorgar rol admin a un usuario ya registrado en la app
npm run make-admin -- tu@email.com
```

### 4. Verificacion

```bash
API_URL=https://nicommerce-api.onrender.com \
TEST_EMAIL=tu@email.com TEST_PASSWORD=tu-password ./test-flow.sh
```

Ademas: abrir el frontend en Vercel, comprobar catalogo sin sesion, registro, checkout completo y panel admin.
