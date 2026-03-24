const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'teslapj.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    summary TEXT,
    author TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const sampleNews = [
  {
    title: '特斯拉最新车型配件上市',
    summary: 'TeslaPJ 全新推出 Model 3/Y 焕新版专用配件，包括手机支架、餐盘小桌板等，为您的爱车增添更多便利！',
    content: `
      <h2>全新配件，焕新体验</h2>
      <p>TeslaPJ 很高兴地宣布，我们全新推出了 Model 3/Y 焕新版专用配件系列！这些配件经过精心设计，完美适配您的特斯拉爱车。</p>
      
      <h3>主要新品包括：</h3>
      <ul>
        <li><strong>超A特斯拉手机支架</strong> - 稳固安装，不挡视线</li>
        <li><strong>车载餐盘小桌板</strong> - 办公用餐两不误</li>
        <li><strong>档杆碳纤维套</strong> - 质感提升，保护原车</li>
        <li><strong>飞机Yoke方向盘</strong> - 赛车风格，个性十足</li>
      </ul>
      
      <p>所有产品均采用高品质材料制造，确保安全耐用。快来选购吧！</p>
    `,
    image_url: '',
    author: 'TeslaPJ 编辑部'
  },
  {
    title: '2026年汽车配饰流行趋势',
    summary: '2026年汽车配饰流行趋势发布，碳纤维、极简设计、智能化成为关键词，为您的爱车打造时尚座舱！',
    content: `
      <h2>2026 流行趋势前瞻</h2>
      <p>随着汽车科技的不断发展，汽车配饰也在经历着变革。2026年，我们将看到更多创新设计和智能功能的出现。</p>
      
      <h3>三大趋势关键词：</h3>
      <ul>
        <li><strong>碳纤维风潮</strong> - 轻量化、高强度的碳纤维材质将更加普及</li>
        <li><strong>极简设计</strong> - 简约而不简单，注重功能性和美观性的平衡</li>
        <li><strong>智能化升级</strong> - 更多带电子功能的配饰将进入市场</li>
      </ul>
      
      <p>TeslaPJ 将紧跟潮流，为您带来最前沿的汽车配饰产品！</p>
    `,
    image_url: '',
    author: '潮流分析师'
  },
  {
    title: '如何选择合适的汽车脚垫',
    summary: '汽车脚垫选购指南来了！从材质、版型、清洁难度三个维度，教您挑选最适合的汽车脚垫！',
    content: `
      <h2>脚垫选购完全指南</h2>
      <p>汽车脚垫是日常使用最频繁的配饰之一，选择一款合适的脚垫能让您的用车体验提升不少。</p>
      
      <h3>选购要点：</h3>
      <ul>
        <li><strong>材质选择</strong> - TPE 材质防水耐磨，是目前的主流选择</li>
        <li><strong>版型贴合</strong> - 一定要选择专车专用的全包围脚垫</li>
        <li><strong>清洁便利</strong> - 选择容易清洁、速干的材质</li>
        <li><strong>环保健康</strong> - 注意选择无异味的环保材质</li>
      </ul>
      
      <p>TeslaPJ 提供多款高品质脚垫，完美适配特斯拉各车型！</p>
    `,
    image_url: '',
    author: '用车达人'
  },
  {
    title: '汽车内饰保养小技巧',
    summary: '日常用车，内饰保养很重要！本文为您整理了汽车内饰清洁、护理、保护的实用技巧，让您的爱车始终如新！',
    content: `
      <h2>内饰保养全攻略</h2>
      <p>汽车内饰的保养不仅关乎美观，更影响用车体验和车辆保值率。掌握正确的保养方法，让您的爱车始终保持最佳状态。</p>
      
      <h3>日常保养建议：</h3>
      <ul>
        <li><strong>定期清洁</strong> - 每周至少一次简单清洁，每月一次深度清洁</li>
        <li><strong>避免暴晒</strong> - 长时间停车尽量选择阴凉处，或使用遮阳挡</li>
        <li><strong>使用保护套</strong> - 方向盘套、座椅垫等可以有效保护原车内饰</li>
        <li><strong>专业护理</strong> - 真皮座椅建议定期使用专业护理产品</li>
      </ul>
      
      <p>TeslaPJ 提供多款内饰保护产品，让保养变得更简单！</p>
    `,
    image_url: '',
    author: '汽车美容专家'
  },
  {
    title: 'TeslaPJ春季促销活动',
    summary: '春暖花开，TeslaPJ 春季特惠来袭！全场商品低至8折，更有满减优惠和赠品活动，快来选购吧！',
    content: `
      <h2>春季特惠，温暖启程</h2>
      <p>在这春暖花开的季节，TeslaPJ 为您带来诚意满满的春季促销活动！</p>
      
      <h3>活动内容：</h3>
      <ul>
        <li><strong>全场8折起</strong> - 指定商品低至8折优惠</li>
        <li><strong>满额立减</strong> - 满399减50，满599减100</li>
        <li><strong>买就送</strong> - 购买指定商品赠送精美礼品</li>
        <li><strong>新品特惠</strong> - 新品上市立享9折</li>
      </ul>
      
      <p>活动时间有限，快来选购您心仪的商品吧！</p>
    `,
    image_url: '',
    author: 'TeslaPJ 运营部'
  },
  {
    title: '新品方向盘套试用体验',
    summary: 'TeslaPJ 新品碳纤维方向盘套试用评测！从安装、手感、外观三个维度，为您带来真实的使用体验分享！',
    content: `
      <h2>新品评测：碳纤维方向盘套</h2>
      <p>很高兴能第一时间体验 TeslaPJ 最新推出的碳纤维方向盘套！下面为大家带来详细的试用报告。</p>
      
      <h3>评测维度：</h3>
      <ul>
        <li><strong>安装体验</strong> - 安装简单，无需工具，10分钟搞定</li>
        <li><strong>握感表现</strong> - 防滑设计，握感舒适，四季通用</li>
        <li><strong>外观效果</strong> - 碳纤维纹理，运动感十足，提升内饰档次</li>
        <li><strong>实用性</strong> - 保护原车方向盘，提升握感，一举两得</li>
      </ul>
      
      <p>总体评价：性价比很高，推荐给喜欢运动风格的车友！</p>
    `,
    image_url: '',
    author: '试驾评测员'
  }
];

const insertNews = db.prepare(
  'INSERT INTO news (title, content, summary, image_url, author) VALUES (?, ?, ?, ?, ?)'
);

sampleNews.forEach(news => {
  insertNews.run(
    news.title,
    news.content,
    news.summary,
    news.image_url || null,
    news.author || null
  );
});

console.log('Sample news inserted successfully!');
console.log(`Inserted ${sampleNews.length} news items`);

db.close();
