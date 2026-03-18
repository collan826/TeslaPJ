<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 shadow-lg">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">🚗 TeslaPJ 汽车配饰商城</h1>
        <p class="text-gray-300 mt-2">专业的汽车配饰配件一站式购物平台</p>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">商品列表</h2>
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">加载中...</p>
        </div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <span class="text-gray-500">商品图片</span>
            </div>
            <div class="p-4">
              <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">{{ product.category }}</span>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-red-600">¥{{ product.price.toFixed(2) }}</span>
                <span class="text-sm text-gray-500">库存: {{ product.stock }}</span>
              </div>
              <button class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                加入购物车
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-white py-6 mt-12">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2026 TeslaPJ. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const products = ref([])
    const loading = ref(true)
    const error = ref('')

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products')
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
      products,
      loading,
      error
    }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
