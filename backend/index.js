const pool = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const skateProducts = [
  {
    name: 'Tabla Street Pro 8.0',
    price: 54990,
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Trucks Hollow 139mm',
    price: 32990,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Ruedas Park 54mm 99A',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Rodamientos ABEC 7 Shielded',
    price: 16990,
    image: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Lija Premium Black Grip',
    price: 7990,
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Zapatillas Vulcan Canvas',
    price: 45990,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
];

async function seedProducts() {
  try {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM products');

    if (rows[0].count > 0) {
      return;
    }

    for (const product of skateProducts) {
      await pool.query(
        'INSERT INTO products (name, price, image) VALUES ($1, $2, $3)',
        [product.name, product.price, product.image]
      );
    }

    console.log('Catalogo inicial de skateboarding cargado');
  } catch (err) {
    console.error('No se pudo cargar el catalogo inicial', err);
  }
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

seedProducts();

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

app.post('/products', async (req, res) => {
  const { name, price, image } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING *',
      [name, price, image]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear producto');
  }
});
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar');
  }
});
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar');
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

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
      'secreto123',
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error login');
  }
});
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('No token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secreto123');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Token inválido');
  }
};
app.get('/protected', authMiddleware, (req, res) => {
  res.send('Ruta protegida 🔐');
});
app.post('/checkout', async (req, res) => {
  const { cart } = req.body;

  try {
    // 1. crear orden
    const orderResult = await pool.query(
      'INSERT INTO orders DEFAULT VALUES RETURNING *'
    );

    const orderId = orderResult.rows[0].id;

    // 2. guardar items
    for (const item of cart) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.json({ message: 'Compra realizada', orderId });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error en checkout');
  }
});
