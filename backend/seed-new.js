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
  { name: '特斯拉手机支架', description: '超A特斯拉手机支架，适用焕新ModelYYL3车载出风口', price: 199.00, category: '电子', image_url: '', stock: 100 },
  { name: '车载餐盘小桌板', description: '帝博车载餐盘小桌板子，适用于特斯拉焕新ModelY3电脑办公改装', price: 199.00, category: '内饰', image_url: '', stock: 100 },
  { name: '档杆碳纤维套', description: '帝博档杆碳纤维套怀挡，适用于特斯拉Model3Y把雨刷保护改装饰', price: 199.00, category: '内饰', image_url: '', stock: 100 },
  { name: '飞机Yoke方向盘', description: '帝博飞机Yoke方向盘，适用于特斯拉焕新Model3Y原厂碳纤改装丫', price: 199.00, category: '内饰', image_url: '', stock: 100 },
  { name: '港版右舵脚垫', description: '帝博港版右舵脚垫，适用于特斯拉ModelY3焕新汽车tpe地垫内饰', price: 199.00, category: '内饰', image_url: '', stock: 100 },
  { name: '后备箱储物盒', description: '帝博后备箱储物盒侧边，适用特斯拉焕新ModelY3收纳装饰YL配件神器', price: 199.00, category: '收纳', image_url: '', stock: 100 },
  { name: '空调出风口挂钩', description: '帝博适用特斯拉ModelYL空调出风口挂钩B柱后排座椅吊钩保护罩', price: 199.00, category: '内饰', image_url: '', stock: 100 },
  { name: '手扶箱增高垫', description: '帝博手扶箱增高垫，适用于特斯拉焕新ModelY3YL保护套储物盒', price: 199.00, category: '内饰', image_url: '', stock: 100 },
  { name: '座椅下护角', description: '帝博座椅下护角，适用于特斯拉焕新版Model YL后排防踢垫门槛条', price: 199.00, category: '内饰', image_url: '', stock: 100 },
  { name: '导航屏幕膜保护套', description: '适用焕新版特斯拉Model3Y导航屏幕膜保护套硅胶框中控YL改装', price: 199.00, category: '电子', image_url: '', stock: 100 },
  { name: '中控储物盒', description: '适用焕新版特斯拉model3Y中控储物盒内饰YL收纳改装配件车载好物', price: 199.00, category: '收纳', image_url: '', stock: 100 },
  { name: '车门储物盒', description: '适用于特斯拉焕新版Model3Y车门储物盒YL全TPE门槽收纳垫装饰', price: 199.00, category: '收纳', image_url: '', stock: 100 }
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
