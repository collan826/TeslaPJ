const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'teslapj.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);

app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, description, price, category, image_url, stock } = req.body;
  const result = db.prepare(
    'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, description, price, category, image_url, stock);
  res.json({ id: result.lastInsertRowid, name, description, price, category, image_url, stock });
});

app.put('/api/products/:id', (req, res) => {
  const { name, description, price, category, image_url, stock } = req.body;
  const result = db.prepare(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock = ? WHERE id = ?'
  ).run(name, description, price, category, image_url, stock, req.params.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ message: 'Product deleted successfully' });
});

app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, customer_phone, items } = req.body;
  
  let total_amount = 0;
  items.forEach(item => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (product) {
      total_amount += product.price * item.quantity;
    }
  });

  const orderResult = db.prepare(
    'INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount) VALUES (?, ?, ?, ?)'
  ).run(customer_name, customer_email, customer_phone, total_amount);

  items.forEach(item => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
    if (product) {
      db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
      ).run(orderResult.lastInsertRowid, item.product_id, item.quantity, product.price);
    }
  });

  res.json({ id: orderResult.lastInsertRowid, total_amount, status: 'pending' });
});

app.get('/api/orders', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
