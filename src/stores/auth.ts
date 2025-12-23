import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // state
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  // computed
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.isAdmin || false)

  // actions
  function login(response: LoginResponse) {
    token.value = response.token
    user.value = {
      username: response.username,
      isAdmin: response.isAdmin
    }
    localStorage.setItem('token', response.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  function restore() {
    token.value = localStorage.getItem('token')
    // 用户信息需要调用/getCurrentUser API，暂时不实现
  }

  return { token, user, isAuthenticated, isAdmin, login, logout, restore }
})