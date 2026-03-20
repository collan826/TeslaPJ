<template>
  <div v-if="showAdmin">
    <Admin @show-front="showAdmin = false" />
  </div>
  <div v-else id="body">
    <!-- 顶部：LOGO + 导航栏 -->
    <header id="head">
      <div class="header-content">
        <div id="logo">
          <img id="img_logo" src="./images/logo.png" alt="TeslaPJ" />
        </div>
        <nav id="columnList" class="columnList">
          <a href="#" class="current">🏠 首页</a>
          <a href="#">🚙 特斯拉专用</a>
          <a href="#">🎨 内饰改装</a>
          <a href="#">🔌 电子电器</a>
          <a href="#">🧹 清洁收纳</a>
          <a href="#">🔧 维修保养</a>
        </nav>
      </div>
    </header>

    <!-- 大Banner图 -->
    <div id="banner">
      <div class="banner_img" id="banner_img">
        <img id="img_banner" src="./images/banner.jpg" alt="TeslaPJ" />
      </div>
    </div>

    <!-- 中间的内容主体 -->
    <div class="content indexBody">
      <!-- 关于我们 -->
      <div class="aboutUs">
        <div class="title">
          <a href="#" class="siteColumnName">关于我们</a>
          <a href="#" class="more">更多>></a>
        </div>
        <div class="siteColumnContent">
          <img class="aboutUsImg" src="./images/about-us.jpg" alt="LOGO" />
          TeslaPJ专业汽车配饰商城，致力于为特斯拉车主提供高品质的汽车配饰产品。我们拥有专业的研发团队和完善的供应链体系，确保每一件产品都符合严格的质量标准。选择TeslaPJ，选择品质与信赖！
        </div>
      </div>
      
      <!-- 新闻列表 -->
      <div class="newsList">
        <div class="title">
          <a href="#" class="siteColumnName">新闻资讯</a>
          <a href="#" class="more">更多>></a>
        </div>
        <div class="siteColumnContent">
          <a href="#">📰 特斯拉最新车型配件上市</a>
          <a href="#">📰 2026年汽车配饰流行趋势</a>
          <a href="#">📰 如何选择合适的汽车脚垫</a>
          <a href="#">📰 汽车内饰保养小技巧</a>
          <a href="#">📰 TeslaPJ春季促销活动</a>
          <a href="#">📰 新品方向盘套试用体验</a>
        </div>
      </div>

      <!-- 产品列表 -->
      <div class="imageList">
        <div class="title">
          <a href="#" class="siteColumnName">产品展示</a>
          <a href="#" class="more">更多>></a>
        </div>
        <div class="siteColumnContent">
          <a href="#" v-for="(product, index) in newProducts" :key="index">
            <img :src="product.image" :alt="product.name" />
            <div>{{ product.name }}</div>
          </a>
        </div>
      </div>
      
    </div>

    <!-- 网站尾部 -->
    <footer id="foot">
      <div class="copyright">
        <div style="width: 1100px; margin:0 auto; text-align:left;">
          <span style="float:right;">
            <a href="#">关于我们</a> | 
            <a href="#">联系方式</a> | 
            <a href="#">网站地图</a> | 
            <a href="#">友情链接</a> | 
            <a href="#" @click.prevent="showAdmin = true" style="color: #9333ea;">🔧 管理后台</a>
          </span>
          © 2026 TeslaPJ. All rights reserved. | 专业汽车配饰商城
        </div>
      </div>
      <div style="clear:both;"></div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Admin from './Admin.vue'
import './style.css'

// 导入商品图片
import img1 from './assets/products/帝博超A特斯拉手机支架适用焕新ModelYYL3车载出风口tesl_a配件.png'
import img2 from './assets/products/帝博车载餐盘小桌板子适用于特斯拉焕新ModelY3电脑办公改装配件.png'
import img3 from './assets/products/帝博档杆碳纤维套怀挡适用于特斯拉Model3Y把雨刷保护改装饰配件.png'
import img4 from './assets/products/帝博飞机Yoke方向盘适用于特斯拉焕新Model3Y原厂碳纤改装丫配件.png'
import img5 from './assets/products/帝博港版右舵脚垫适用于特斯拉ModelY3焕新汽车tpe地垫内饰配件.png'
import img6 from './assets/products/帝博后备箱储物盒侧边适用特斯拉焕新ModelY3收纳装饰YL配件神器.png'
import img7 from './assets/products/帝博适用特斯拉ModelYL空调出风口挂钩B柱后排座椅吊钩保护罩配件.png'
import img8 from './assets/products/帝博手扶箱增高垫适用于特斯拉焕新ModelY3YL保护套储物盒配件.png'
import img9 from './assets/products/帝博座椅下护角适用于特斯拉焕新版Model_YL后排防踢垫门槛条配件.png'
import img10 from './assets/products/适用焕新版特斯拉Model3Y导航屏幕膜保护套硅胶框中控YL改装配件.png'

// 新商品数据
const newProducts = [
  { name: '特斯拉手机支架', image: img1 },
  { name: '车载餐盘小桌板', image: img2 },
  { name: '档杆碳纤维套', image: img3 },
  { name: '飞机Yoke方向盘', image: img4 },
  { name: '港版右舵脚垫', image: img5 },
  { name: '后备箱储物盒', image: img6 },
  { name: '空调出风口挂钩', image: img7 },
  { name: '手扶箱增高垫', image: img8 },
  { name: '座椅下护角', image: img9 },
  { name: '导航屏幕膜保护套', image: img10 }
]

export default {
  name: 'App',
  components: { Admin },
  setup() {
    const showAdmin = ref(false)
    const products = ref([])
    const loading = ref(true)
    const error = ref('')

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://192.168.0.120:3000/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        products.value = await response.json()
      } catch (err) {
        error.value = '无法加载商品数据，请确保后端服务已启动'
        console.error('Error fetching products:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      showAdmin,
      products,
      loading,
      error,
      newProducts
    }
  }
}
</script>
