<template>
  <div class="news-list-container">
    <div class="news-list-header">
      <button @click="goBack" class="back-button">← 返回首页</button>
      <h1 class="page-title">📰 新闻资讯</h1>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="news-list-content">
      <div v-for="news in newsList" :key="news.id" class="news-card" @click="viewNews(news.id)">
        <div class="news-card-main">
          <h3 class="news-card-title">{{ news.title }}</h3>
          <p v-if="news.summary" class="news-card-summary">{{ news.summary }}</p>
          <div class="news-card-meta">
            <span class="news-card-date">📅 {{ formatDate(news.created_at) }}</span>
            <span v-if="news.author" class="news-card-author">✍️ {{ news.author }}</span>
          </div>
        </div>
        <div class="news-card-arrow">→</div>
      </div>
      
      <div v-if="newsList.length === 0" class="news-empty">
        暂无新闻资讯
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'NewsList',
  props: {
    apiBase: {
      type: String,
      required: true
    }
  },
  emits: ['go-back', 'view-news'],
  setup(props, { emit }) {
    const newsList = ref([])
    const loading = ref(true)
    const error = ref('')

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const goBack = () => {
      emit('go-back')
    }

    const viewNews = (newsId) => {
      emit('view-news', newsId)
    }

    const fetchNews = async () => {
      try {
        loading.value = true
        const response = await fetch(`${props.apiBase}/news`)
        if (!response.ok) {
          throw new Error('获取新闻列表失败')
        }
        newsList.value = await response.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchNews()
    })

    return {
      newsList,
      loading,
      error,
      formatDate,
      goBack,
      viewNews
    }
  }
}
</script>

<style scoped>
.news-list-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background: #f5f5f5;
}

.news-list-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-button {
  padding: 10px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button:hover {
  background: #9333ea;
  color: white;
  border-color: #9333ea;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #c33;
}

.news-list-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.news-card-main {
  flex: 1;
}

.news-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.news-card-summary {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.news-card-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 13px;
}

.news-card-arrow {
  font-size: 20px;
  color: #9333ea;
  opacity: 0;
  transition: opacity 0.3s;
}

.news-card:hover .news-card-arrow {
  opacity: 1;
}

.news-empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}
</style>
