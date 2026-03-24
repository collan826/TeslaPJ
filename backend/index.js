const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

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

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    email TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 密码哈希函数
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// 初始化默认管理员账号（如果不存在）
const initAdmin = () => {
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    const defaultPassword = 'admin123'; // 默认密码
    const passwordHash = hashPassword(defaultPassword);
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', passwordHash, 'admin');
    console.log('默认管理员账号已创建: admin / admin123');
  }
};

initAdmin();

// 会话存储（简单实现，生产环境建议使用 redis）
const sessions = new Map();

// 生成会话 token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 鉴权中间件
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录，请先登录' });
  }
  
  const token = authHeader.substring(7);
  if (!sessions.has(token)) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
  
  req.user = sessions.get(token);
  next();
};

// 管理员登录 API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  const passwordHash = hashPassword(password);
  if (passwordHash !== user.password_hash) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  const token = generateToken();
  sessions.set(token, { id: user.id, username: user.username, role: user.role });
  
  // 设置会话过期时间（24小时）
  setTimeout(() => {
    sessions.delete(token);
  }, 24 * 60 * 60 * 1000);
  
  res.json({ token, username: user.username, role: user.role });
});

// 普通用户注册 API
app.post('/api/register', (req, res) => {
  const { username, password, email, phone } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  if (username.length < 3) {
    return res.status(400).json({ error: '用户名至少需要3个字符' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少需要6个字符' });
  }
  
  // 检查用户名是否已存在
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existingUser) {
    return res.status(400).json({ error: '用户名已存在' });
  }
  
  const passwordHash = hashPassword(password);
  
  try {
    const result = db.prepare(
      'INSERT INTO users (username, password_hash, role, email, phone) VALUES (?, ?, ?, ?, ?)'
    ).run(username, passwordHash, 'user', email || null, phone || null);
    
    res.json({ id: result.lastInsertRowid, username, message: '注册成功' });
  } catch (err) {
    res.status(500).json({ error: '注册失败，请重试' });
  }
});

// 普通用户登录 API
app.post('/api/user/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  const passwordHash = hashPassword(password);
  if (passwordHash !== user.password_hash) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  const token = generateToken();
  sessions.set(token, { id: user.id, username: user.username, role: user.role });
  
  // 设置会话过期时间（7天）
  setTimeout(() => {
    sessions.delete(token);
  }, 7 * 24 * 60 * 60 * 1000);
  
  res.json({ token, username: user.username, role: user.role, email: user.email, phone: user.phone });
});

// 原登录 API 重定向到管理员登录（保持向后兼容）
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  const passwordHash = hashPassword(password);
  if (passwordHash !== user.password_hash) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  const token = generateToken();
  sessions.set(token, { id: user.id, username: user.username, role: user.role });
  
  setTimeout(() => {
    sessions.delete(token);
  }, 24 * 60 * 60 * 1000);
  
  res.json({ token, username: user.username, role: user.role });
});

// 登出 API
app.post('/api/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    sessions.delete(token);
  }
  res.json({ message: '登出成功' });
});

// 商品列表（公开接口，不需要鉴权）
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

app.post('/api/products', authMiddleware, (req, res) => {
  const { name, description, price, category, image_url, stock } = req.body;
  const result = db.prepare(
    'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, description, price, category, image_url, stock);
  res.json({ id: result.lastInsertRowid, name, description, price, category, image_url, stock });
});

app.put('/api/products/:id', authMiddleware, (req, res) => {
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

app.delete('/api/products/:id', authMiddleware, (req, res) => {
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

app.get('/api/orders', authMiddleware, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`局域网访问地址: http://192.168.0.120:${PORT}`);
});
