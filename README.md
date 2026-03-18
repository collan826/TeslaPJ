# TeslaPJ

TeslaPJ - 汽车配饰配件商城网站

## 项目简介

这是一个用于展示和销售汽车配饰配件的电商网站项目。

## 技术栈

**前端：**
- Vue 3
- Vite
- Tailwind CSS

**后端：**
- Node.js
- Express
- SQLite (better-sqlite3)

## 项目结构

```
TeslaPJ/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── package.json
│   └── vite.config.js
├── backend/           # 后端项目
│   ├── index.js       # 服务器入口
│   └── package.json
└── README.md
```

## 快速开始

### 后端启动

```bash
cd backend
npm install
node index.js
```

后端服务运行在 http://localhost:3000

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 http://localhost:5173

## API 接口

### 商品接口

- `GET /api/products` - 获取所有商品
- `GET /api/products/:id` - 获取单个商品
- `POST /api/products` - 创建商品

### 订单接口

- `GET /api/orders` - 获取所有订单
- `POST /api/orders` - 创建订单

## 数据库

使用 SQLite 数据库，文件位于 `backend/teslapj.db`

包含以下表：
- `products` - 商品表
- `orders` - 订单表
- `order_items` - 订单商品表

## 开发指南

待添加...

## 许可证

待添加...
