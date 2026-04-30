require('dotenv').config();
const pool = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

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

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email y password requeridos');
  }

  if (password.length < 6) {
    return res.status(400).send('Password debe tener al menos 6 caracteres');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email y password requeridos');
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).send('Usuario no existe');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Password incorrecto');
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

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

app.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, price, image, stock } = req.body;

  if (!name || !price || price <= 0) {
    return res.status(400).send('Nombre y precio válido requeridos');
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, image, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.trim(), Number(price), image || null, stock || 0]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear producto');
  }
});

app.put('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, image, stock } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, image = $3, stock = $4 WHERE id = $5 RETURNING *',
      [name.trim(), Number(price), image || null, stock, id]
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
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
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

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let total = 0;
    for (const item of cart) {
      const product = await client.query(
        'SELECT stock, price FROM products WHERE id = $1',
        [item.id]
      );

      if (product.rows.length === 0) {
        throw new Error(`Producto ${item.id} no encontrado`);
      }

      if (product.rows[0].stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.name}`);
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
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
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
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message || 'Error en checkout' });
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

  if (!['pending', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).send('Estado inválido');
  }

  try {
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