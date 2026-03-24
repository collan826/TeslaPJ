<template>
  <div class="user-auth-container">
    <div class="user-auth-box">
      <div class="auth-tabs">
        <button 
          @click="activeTab = 'login'" 
          :class="['auth-tab', activeTab === 'login' ? 'active' : '']"
        >
          登录
        </button>
        <button 
          @click="activeTab = 'register'" 
          :class="['auth-tab', activeTab === 'register' ? 'active' : '']"
        >
          注册
        </button>
        <button @click="$emit('cancel')" class="close-button">✕</button>
      </div>

      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-username">用户名</label>
          <input
            id="login-username"
            v-model="loginForm.username"
            type="text"
            required
            placeholder="请输入用户名"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="login-password">密码</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            required
            placeholder="请输入密码"
            class="form-input"
            @keyup.enter="handleLogin"
          />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="register-username">用户名 *</label>
          <input
            id="register-username"
            v-model="registerForm.username"
            type="text"
            required
            placeholder="至少3个字符"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="register-password">密码 *</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            required
            placeholder="至少6个字符"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="register-confirm-password">确认密码 *</label>
          <input
            id="register-confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            required
            placeholder="请再次输入密码"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="register-email">邮箱（可选）</label>
          <input
            id="register-email"
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="register-phone">手机号（可选）</label>
          <input
            id="register-phone"
            v-model="registerForm.phone"
            type="tel"
            placeholder="请输入手机号"
            class="form-input"
          />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'UserAuth',
  props: ['apiBase'],
  emits: ['login-success', 'cancel'],
  setup(props, { emit }) {
    const activeTab = ref('login')
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const loginForm = ref({
      username: '',
      password: ''
    })

    const registerForm = ref({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: ''
    })

    const handleLogin = async () => {
      if (!loginForm.value.username || !loginForm.value.password) {
        error.value = '请输入用户名和密码'
        return
      }

      loading.value = true
      error.value = ''
      success.value = ''

      try {
        const response = await fetch(`${props.apiBase}/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: loginForm.value.username,
            password: loginForm.value.password
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '登录失败')
        }

        // 保存用户信息到 localStorage
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('userInfo', JSON.stringify({
          username: data.username,
          role: data.role,
          email: data.email,
          phone: data.phone
        }))

        emit('login-success', data)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const handleRegister = async () => {
      if (!registerForm.value.username || !registerForm.value.password) {
        error.value = '请输入用户名和密码'
        return
      }

      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        error.value = '两次输入的密码不一致'
        return
      }

      loading.value = true
      error.value = ''
      success.value = ''

      try {
        const response = await fetch(`${props.apiBase}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: registerForm.value.username,
            password: registerForm.value.password,
            email: registerForm.value.email || undefined,
            phone: registerForm.value.phone || undefined
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '注册失败')
        }

        success.value = '注册成功！正在跳转到登录页面...'
        
        // 清空注册表单
        registerForm.value = {
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          phone: ''
        }
        
        // 2秒后自动跳转到登录页面
        setTimeout(() => {
          activeTab.value = 'login'
          success.value = ''
        }, 1500)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      activeTab,
      loading,
      error,
      success,
      loginForm,
      registerForm,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style scoped>
.user-auth-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.user-auth-box {
  background: white;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.auth-tabs {
  display: flex;
  background: #f5f5f5;
  position: relative;
}

.auth-tab {
  flex: 1;
  padding: 16px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-tab:hover {
  color: #333;
}

.auth-tab.active {
  color: #9333ea;
  background: white;
}

.close-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-button:hover {
  background: #eee;
  color: #333;
}

.auth-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #9333ea;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.auth-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
