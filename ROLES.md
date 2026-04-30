# Separación de Roles - Nicommerce

## Descripción

Se implementó un sistema de roles (admin/cliente) para separar las funcionalidades de administración de las funcionalidades de tienda.

## Roles Definidos

### Admin
- Acceso completo al panel de administración
- Puede gestionar productos (crear, editar, eliminar)
- Puede ver todas las órdenes del sistema
- Puede cambiar el estado de las órdenes
- Puede gestionar usuarios y cambiar roles
- Ve badge "ADMIN" en el header

### Cliente
- Acceso a la tienda pública
- Puede ver catálogo de productos
- Puede agregar productos al carrito
- Puede realizar compras (checkout)
- Puede ver su historial de órdenes

## Cambios en Base de Datos

### Tabla users (actualizada)
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client';
```

- **Campo**: `role` (DEFAULT 'client')
- **Valores**: 'admin' o 'client'

## Cambios en Backend (index.js)

### Middleware de Admin
```javascript
const adminMiddleware = async (req, res, next) => {
  // Verifica que el usuario tenga rol 'admin'
  const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
  if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
    return res.status(403).send('Acceso denegado: se requiere rol admin');
  }
  next();
};
```

### Rutas Protegidas por Admin
- `POST /products` - Crear producto (solo admin)
- `PUT /products/:id` - Editar producto (solo admin)
- `DELETE /products/:id` - Eliminar producto (solo admin)
- `GET /admin/orders` - Ver todas las órdenes (solo admin)
- `PUT /admin/orders/:id/status` - Cambiar estado de orden (solo admin)
- `GET /admin/users` - Listar usuarios (solo admin)
- `PUT /admin/users/:id/role` - Cambiar rol de usuario (solo admin)

### Rutas Públicas
- `GET /products` - Ver productos (pública)

### Login devuelve el rol
```javascript
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
res.json({ token, role: user.role });
```

## Cambios en Frontend

### Nuevas Tipos (types.ts)
```typescript
export type User = {
  id: number
  email: string
  role: 'admin' | 'client'
}
```

### App.tsx
- Estado: `userRole` - Almacena el rol del usuario
- Al hacer login, se guarda el rol: `setUserRole(res.data.role || 'client')`
- Condicional para mostrar funciones de admin:
  ```tsx
  const isAdmin = userRole === 'admin'
  ```
- Si `isAdmin`: muestra formulario de productos, botones de eliminar
- Si `!isAdmin`: solo ve el catálogo y puede comprar

### Nuevos Componentes

#### AdminDashboard.tsx
Panel de administración que incluye:
- **Pestaña Órdenes**: Lista todas las órdenes con:
  - Estado visual (pending, paid, shipped, delivered, cancelled)
  - Botones para cambiar estado rápido
  - Total formateado
- **Pestaña Usuarios**: Lista todos los usuarios con:
  - Email y rol actual
  - Selector para cambiar rol (client ↔ admin)

### Componentes Actualizados

#### ProductsGrid.tsx
- Nueva prop: `isAdmin?: boolean`
- Solo muestra botón "Eliminar" si `isAdmin` es true

#### ProductCard.tsx
- Nueva prop: `isAdmin?: boolean`
- Solo muestra botón "Eliminar" si `isAdmin` es true

#### CartSidebar.tsx
- Eliminado (ya no se usa en panel de admin)

## Cómo Usar

### 1. Crear un Usuario Admin
```sql
-- En PostgreSQL
INSERT INTO users (email, password, role) 
VALUES ('admin@nicommerce.com', '$2b$10$...', 'admin');
```

### 2. Login como Admin
- Usa credenciales de admin
- Verás badge "ADMIN" en header
- Aparecerá botón "Panel Admin"
- Formulario de productos visible

### 3. Login como Cliente
- Usa credenciales de cliente (role = 'client')
- Solo ve el catálogo y carrito
- No puede administrar productos

### 4. Gestionar Roles
1. Login como admin
2. Entra al "Panel Admin"
3. Pestaña "Usuarios"
4. Cambia el rol usando el selector

## Seguridad

- Las rutas de admin están protegidas por `authMiddleware` + `adminMiddleware`
- El frontend oculta opciones de admin basado en el rol
- **Nota**: La seguridad del frontend es solo visual; la validación real está en el backend

## Estado Actual

✅ Backend compila sin errores
✅ Frontend compila sin errores
✅ Base de datos actualizada
✅ Middleware de admin implementado
✅ Panel de administración creado
✅ Separación visual de roles

## Pruebas

1. **Login admin**: Debería ver panel de admin
2. **Login cliente**: Solo debería ver tienda
3. **Ruta protegida**: Intentar `DELETE /products/1` sin ser admin → 403
4. **Cambiar rol**: Como admin, cambiar un usuario a 'admin'
