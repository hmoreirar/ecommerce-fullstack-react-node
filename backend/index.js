require('dotenv').config();
const pool = require('./db');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Detras de un proxy (Render, nginx, etc.) una sola capa:
// necesario para que el rate limiting use la IP real del cliente.
app.set('trust proxy', 1);

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe existir y tener al menos 32 caracteres');
}

// Error de negocio: su mensaje es seguro de mostrar al cliente.
// Cualquier otro error se responde con un mensaje generico.
class CheckoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CheckoutError';
  }
}

function normalizeTags(tags) {
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);
  }

  if (Array.isArray(tags) && tags.every((tag) => typeof tag === 'string')) {
    return tags
      .map((tag) => tag.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);
  }

  return tags === undefined ? [] : null;
}

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '100kb' }));

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Demasiados intentos. Intenta nuevamente más tarde.',
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('No token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Token inválido');
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).send('Acceso denegado: se requiere rol admin');
    }
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error de autenticación');
  }
};

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.post('/register', authRateLimit, async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const { password } = req.body;

  if (!email || typeof password !== 'string' || !password) {
    return res.status(400).send('Email y password requeridos');
  }

  if (password.length < 6) {
    return res.status(400).send('Password debe tener al menos 6 caracteres');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, role, created_at',
      [email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).send('Email ya registrado');
    }
    console.error(err);
    res.status(500).send('Error al registrar');
  }
});

app.post('/login', authRateLimit, async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const { password } = req.body;

  if (!email || typeof password !== 'string' || !password) {
    return res.status(400).send('Email y password requeridos');
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).send('Credenciales inválidas');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Credenciales inválidas');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error login');
  }
});

app.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener usuario');
  }
});

app.get('/products', async (req, res) => {
  const { search, category, tag, minPrice, maxPrice } = req.query;
  const values = [];
  const conditions = ['active = TRUE'];

  if (typeof search === 'string' && search.trim()) {
    values.push(`%${search.trim()}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  if (typeof category === 'string' && category.trim()) {
    values.push(category.trim().toLowerCase());
    conditions.push(`category = $${values.length}`);
  }

  if (typeof tag === 'string' && tag.trim()) {
    values.push(tag.trim().toLowerCase());
    conditions.push(`$${values.length} = ANY(tags)`);
  }

  const numericMinPrice = Number(minPrice);
  if (minPrice !== undefined && Number.isFinite(numericMinPrice) && numericMinPrice >= 0) {
    values.push(numericMinPrice);
    conditions.push(`price >= $${values.length}`);
  }

  const numericMaxPrice = Number(maxPrice);
  if (maxPrice !== undefined && Number.isFinite(numericMaxPrice) && numericMaxPrice >= 0) {
    values.push(numericMaxPrice);
    conditions.push(`price <= $${values.length}`);
  }

  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE ${conditions.join(' AND ')} ORDER BY id DESC`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

app.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, price, image, stock, category, tags } = req.body;
  const numericPrice = Number(price);
  const numericStock = Number(stock ?? 0);
  const normalizedCategory = typeof category === 'string' ? category.trim().toLowerCase() : '';
  const normalizedTags = normalizeTags(tags);

  if (typeof name !== 'string' || !name.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericStock) || numericStock < 0 || !normalizedCategory || normalizedTags === null) {
    return res.status(400).send('Nombre, precio, stock, categoría y etiquetas válidos requeridos');
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, image, stock, category, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name.trim(), numericPrice, image || null, numericStock, normalizedCategory, normalizedTags]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear producto');
  }
});

app.put('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, image, stock, category, tags } = req.body;
  const numericPrice = Number(price);
  const numericStock = Number(stock);
  const normalizedCategory = typeof category === 'string' ? category.trim().toLowerCase() : '';
  const normalizedTags = normalizeTags(tags);

  if (typeof name !== 'string' || !name.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericStock) || numericStock < 0 || !normalizedCategory || normalizedTags === null) {
    return res.status(400).send('Nombre, precio, stock, categoría y etiquetas válidos requeridos');
  }

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, image = $3, stock = $4, category = $5, tags = $6 WHERE id = $7 RETURNING *',
      [name.trim(), numericPrice, image || null, numericStock, normalizedCategory, normalizedTags, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar producto');
  }
});

app.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE products SET active = FALSE WHERE id = $1 AND active = TRUE RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar');
  }
});

app.get('/protected', authMiddleware, (req, res) => {
  res.send('Ruta protegida 🔐');
});

app.post('/checkout', authMiddleware, async (req, res) => {
  const { cart, shipping } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Carrito vacío' });
  }

  if (cart.some((item) => !Number.isInteger(Number(item.id)) || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return res.status(400).json({ error: 'El carrito contiene cantidades inválidas' });
  }

  const productIds = cart.map((item) => Number(item.id));
  if (new Set(productIds).size !== productIds.length) {
    return res.status(400).json({ error: 'El carrito contiene productos duplicados' });
  }

  if (!shipping || [shipping.address, shipping.city, shipping.postalCode, shipping.phone]
    .some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ error: 'Los datos de envío son obligatorios' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let total = 0;
    for (const item of cart) {
      const product = await client.query(
        'SELECT stock, price FROM products WHERE id = $1 FOR UPDATE',
        [item.id]
      );

      if (product.rows.length === 0) {
        throw new CheckoutError(`Producto ${item.id} no encontrado`);
      }

      if (product.rows[0].stock < item.quantity) {
        throw new CheckoutError(`Stock insuficiente para ${item.name}`);
      }

      total += product.rows[0].price * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status, shipping_address, shipping_city, shipping_postal_code, phone)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6) RETURNING *`,
      [
        req.user.userId,
        total,
        shipping?.address || '',
        shipping?.city || '',
        shipping?.postalCode || '',
        shipping?.phone || ''
      ]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of cart) {
      const product = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.id]
      );

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, product.rows[0].price]
      );

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
        [item.quantity, item.id]
      );
    }

    await client.query('COMMIT');

    res.json({
      message: 'Compra realizada',
      orderId: orderId,
      total: total
    });

  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error(rollbackErr);
    }
    console.error(err);
    if (err instanceof CheckoutError) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error en checkout' });
  } finally {
    client.release();
  }
});

app.get('/orders', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener órdenes');
  }
});

app.get('/orders/:id', authMiddleware, async (req, res) => {
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).send('Orden no encontrada');
    }

    const itemsResult = await pool.query(
      `SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [req.params.id]
    );

    res.json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el detalle de la orden');
  }
});

app.get('/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener órdenes');
  }
});

app.put('/admin/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedTransitions = {
    pending: ['paid', 'cancelled'],
    paid: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  if (!['pending', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).send('Estado inválido');
  }

  try {
    const currentOrder = await pool.query('SELECT status FROM orders WHERE id = $1', [id]);
    if (currentOrder.rows.length === 0) {
      return res.status(404).send('Orden no encontrada');
    }

    const transitions = allowedTransitions[currentOrder.rows[0].status] || [];
    if (!transitions.includes(status)) {
      return res.status(409).send('Transición de estado no permitida');
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Orden no encontrada');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar orden');
  }
});

app.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener usuarios');
  }
});

app.put('/admin/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['client', 'admin'].includes(role)) {
    return res.status(400).send('Rol inválido');
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar rol');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
