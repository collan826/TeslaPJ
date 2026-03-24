<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gradient-to-r from-purple-900 to-purple-800 text-white py-6 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">🔧 TeslaPJ 管理后台</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm opacity-80">欢迎，{{ adminUsername }}</span>
            <button @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              退出登录
            </button>
            <button @click="goBack" class="bg-white text-purple-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
              返回前台
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- 标签页切换 -->
      <div class="mb-6">
        <div class="flex border-b border-gray-200">
          <button 
            @click="activeTab = 'products'" 
            :class="['px-6 py-3 font-medium', activeTab === 'products' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700']"
          >
            📦 商品管理
          </button>
          <button 
            @click="activeTab = 'orders'" 
            :class="['px-6 py-3 font-medium', activeTab === 'orders' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700']"
          >
            📋 订单管理
          </button>
        </div>
      </div>

      <!-- 商品管理 -->
      <div v-if="activeTab === 'products'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">商品列表</h2>
          <button @click="openAddModal" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
            ➕ 添加商品
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">加载中...</p>
        </div>
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {{ error }}
        </div>
        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">库存</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="product in products" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{{ product.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">¥{{ product.price.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.stock }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="openEditModal(product)" class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                  <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 订单管理 -->
      <div v-if="activeTab === 'orders'">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">订单列表</h2>
        <div v-if="loadingOrders" class="text-center py-8">
          <p class="text-gray-500">加载中...</p>
        </div>
        <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-500">
          暂无订单
        </div>
        <div v-else class="space-y-4">
          <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">订单 #{{ order.id }}</h3>
                <p class="text-sm text-gray-500">{{ order.created_at }}</p>
              </div>
              <span class="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">{{ order.status }}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-500">客户：</span>
                <span class="font-medium">{{ order.customer_name }}</span>
              </div>
              <div>
                <span class="text-gray-500">电话：</span>
                <span class="font-medium">{{ order.customer_phone }}</span>
              </div>
              <div>
                <span class="text-gray-500">总额：</span>
                <span class="font-bold text-red-600">¥{{ order.total_amount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 添加/编辑商品模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">{{ editingProduct ? '编辑商品' : '添加商品' }}</h3>
          <form @submit.prevent="saveProduct">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                <input v-model="formData.name" type="text" required class="w-full border border-gray-300 rounded px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea v-model="formData.description" rows="3" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">价格</label>
                <input v-model.number="formData.price" type="number" step="0.01" required class="w-full border border-gray-300 rounded px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <input v-model="formData.category" type="text" required class="w-full border border-gray-300 rounded px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
                <input v-model="formData.image_url" type="url" class="w-full border border-gray-300 rounded px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">库存</label>
                <input v-model.number="formData.stock" type="number" required class="w-full border border-gray-300 rounded px-3 py-2">
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">取消</button>
              <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Admin',
  props: ['showFront', 'apiBase', 'token'],
  emits: ['show-front', 'logout'],
  setup(props, { emit }) {
    const activeTab = ref('products')
    const products = ref([])
    const orders = ref([])
    const loading = ref(true)
    const loadingOrders = ref(true)
    const error = ref('')
    const showModal = ref(false)
    const editingProduct = ref(null)
    const formData = ref({
      name: '',
      description: '',
      price: 0,
      category: '',
      image_url: '',
      stock: 0
    })

    const adminUsername = ref(localStorage.getItem('adminUsername') || '管理员')

    // 带鉴权的 fetch 封装
    const authFetch = (url, options = {}) => {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      }
      
      if (props.token) {
        headers['Authorization'] = `Bearer ${props.token}`
      }
      
      return fetch(url, {
        ...options,
        headers
      })
    }

    const handleLogout = async () => {
      try {
        await authFetch(`${props.apiBase}/logout`, {
          method: 'POST'
        })
      } catch (err) {
        console.error('登出失败:', err)
      }
      emit('logout')
    }

    const fetchProducts = async () => {
      try {
        loading.value = true
        const response = await authFetch(`${props.apiBase}/products`)
        if (!response.ok) throw new Error('Failed to fetch products')
        products.value = await response.json()
        error.value = ''
      } catch (err) {
        error.value = '无法加载商品数据'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const fetchOrders = async () => {
      try {
        loadingOrders.value = true
        const response = await authFetch(`${props.apiBase}/orders`)
        if (!response.ok) {
          if (response.status === 401) {
            emit('logout')
            return
          }
          throw new Error('Failed to fetch orders')
        }
        orders.value = await response.json()
      } catch (err) {
        console.error(err)
      } finally {
        loadingOrders.value = false
      }
    }

    const openAddModal = () => {
      editingProduct.value = null
      formData.value = {
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: '',
        stock: 0
      }
      showModal.value = true
    }

    const openEditModal = (product) => {
      editingProduct.value = product
      formData.value = { ...product }
      showModal.value = true
    }

    const saveProduct = async () => {
      try {
        const url = editingProduct.value 
          ? `${props.apiBase}/products/${editingProduct.value.id}`
          : `${props.apiBase}/products`
        const method = editingProduct.value ? 'PUT' : 'POST'
        
        const response = await authFetch(url, {
          method,
          body: JSON.stringify(formData.value)
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            emit('logout')
            return
          }
          throw new Error('Failed to save product')
        }
        
        showModal.value = false
        fetchProducts()
      } catch (err) {
        console.error(err)
        alert('保存失败，请重试')
      }
    }

    const deleteProduct = async (id) => {
      if (!confirm('确定要删除这个商品吗？')) return
      
      try {
        const response = await authFetch(`${props.apiBase}/products/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          if (response.status === 401) {
            emit('logout')
            return
          }
          throw new Error('Failed to delete product')
        }
        fetchProducts()
      } catch (err) {
        console.error(err)
        alert('删除失败，请重试')
      }
    }

    const goBack = () => {
      emit('show-front')
    }

    onMounted(() => {
      fetchProducts()
      fetchOrders()
    })

    return {
      goBack,
      activeTab,
      products,
      orders,
      loading,
      loadingOrders,
      error,
      showModal,
      editingProduct,
      formData,
      openAddModal,
      openEditModal,
      saveProduct,
      deleteProduct,
      adminUsername,
      handleLogout
    }
  }
}
</script>
