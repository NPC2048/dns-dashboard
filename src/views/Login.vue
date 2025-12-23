<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import { login } from '@/api/dns'
import type { LoginRequest } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref<LoginRequest>({
  username: '',
  password: ''
})

async function handleSubmit() {
  if (!form.value.username.trim() || !form.value.password.trim()) {
    message.error('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const response = await login(form.value)
    authStore.login(response)
    message.success('登录成功')

    // 跳转到仪表盘或首页
    const redirect = router.currentRoute.value.query.redirect as string || '/dashboard'
    await router.push(redirect)
  } catch (error: any) {
    message.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="login-title">DNS服务器管理</h1>

      <a-card class="login-card" title="登录" :bordered="false">
        <a-form @submit.prevent="handleSubmit">
          <a-form-item label="用户名">
            <a-input
              v-model:value="form.username"
              placeholder="请输入用户名"
              size="large"
              :disabled="loading"
            />
          </a-form-item>

          <a-form-item label="密码">
            <a-input-password
              v-model:value="form.password"
              placeholder="请输入密码"
              size="large"
              :disabled="loading"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              size="large"
              block
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

      </a-card>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.login-content {
  width: 100%;
  max-width: 400px;
}

.login-title {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.login-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 使用与主系统一致的输入框样式 */
:deep(.ant-input-affix-wrapper) {
  width: 100%;
}

</style>