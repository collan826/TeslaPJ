<template>
  <div class="news-detail-container">
    <div class="news-detail-header">
      <button @click="goBack" class="back-button">← 返回首页</button>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="news-detail-content">
      <h1 class="news-title">{{ news.title }}</h1>
      <div class="news-meta">
        <span class="news-date">📅 {{ formatDate(news.created_at) }}</span>
        <span v-if="news.author" class="news-author">✍️ {{ news.author }}</span>
      </div>
      <img v-if="news.image_url" :src="news.image_url" :alt="news.title" class="news-image" />
      <div class="news-body" v-html="news.content"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'NewsDetail',
  props: {
    newsId: {
      type: Number,
      required: true
    },
    apiBase: {
      type: String,
      required: true
    }
  },
  emits: ['go-back'],
  setup(props, { emit }) {
    const news = ref(null)
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

    const fetchNews = async () => {
      try {
        loading.value = true
        const response = await fetch(`${props.apiBase}/news/${props.newsId}`)
        if (!response.ok) {
          throw new Error('新闻不存在')
        }
        news.value = await response.json()
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
      news,
      loading,
      error,
      formatDate,
      goBack
    }
  }
}
</script>

<style scoped>
.news-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.news-detail-header {
  margin-bottom: 30px;
}

.back-button {
  padding: 10px 20px;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button:hover {
  background: #9333ea;
  color: white;
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

.news-detail-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  color: #999;
  font-size: 14px;
}

.news-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 30px;
}

.news-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.news-body :deep(p) {
  margin-bottom: 20px;
}

.news-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

.news-body :deep(h2) {
  font-size: 24px;
  margin: 30px 0 15px;
  color: #333;
}

.news-body :deep(h3) {
  font-size: 20px;
  margin: 25px 0 12px;
  color: #444;
}

.news-body :deep(ul),
.news-body :deep(ol) {
  margin-left: 20px;
  margin-bottom: 20px;
}

.news-body :deep(li) {
  margin-bottom: 8px;
}

.news-body :deep(blockquote) {
  border-left: 4px solid #9333ea;
  padding-left: 20px;
  margin: 20px 0;
  color: #666;
  font-style: italic;
}
</style>
