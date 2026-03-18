const Database = require('better-sqlite3');
const path = require('path');

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

const sampleProducts = [
  {
    name: '特斯拉 Model 3 方向盘套',
    description: '真皮材质，手感舒适，专为 Model 3 设计',
    price: 299.00,
    category: '内饰',
    image_url: 'https://via.placeholder.com/400x300',
    stock: 50
  },
  {
    name: '特斯拉 Model Y 脚垫',
    description: 'TPE 环保材质，防水防污，完美贴合',
    price: 599.00,
    category: '内饰',
    image_url: 'https://via.placeholder.com/400x300',
    stock: 30
  },
  {
    name: '特斯拉 车载充电器',
    description: '快充 65W，双 USB 接口',
    price: 199.00,
    category: '电子',
    image_url: 'https://via.placeholder.com/400x300',
    stock: 100
  },
  {
    name: '特斯拉 手机支架',
    description: '磁吸式，稳固不晃动',
    price: 129.00,
    category: '电子',
    image_url: 'https://via.placeholder.com/400x300',
    stock: 80
  },
  {
    name: '特斯拉 后备箱收纳箱',
    description: '大容量，可折叠，环保材质',
    price: 259.00,
    category: '收纳',
    image_url: 'https://via.placeholder.com/400x300',
    stock: 40
  }
];

const insertProduct = db.prepare(
  'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)'
);

sampleProducts.forEach(product => {
  insertProduct.run(
    product.name,
    product.description,
    product.price,
    product.category,
    product.image_url,
    product.stock
  );
});

console.log('Sample data inserted successfully!');
console.log(`Inserted ${sampleProducts.length} products`);

db.close();
