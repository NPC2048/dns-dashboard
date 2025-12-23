import axios from 'axios'
import type { LoginRequest, LoginResponse } from '@/types/auth'
// import type { AxiosResponse } from 'axios'

// 创建 axios 实例
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5381/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => {
    // 检查是否是SaResult错误格式（code === 500）
    if (response.data?.code === 500) {
      return Promise.reject(new Error(response.data.msg))
    }
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // 未授权，跳转到登录页
      localStorage.removeItem('token')
      const currentPath = window.location.pathname + window.location.search
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
    }
    return Promise.reject(error)
  }
)

// DNS 配置相关 API
export interface UpstreamDnsConfig {
  address: string
  port?: number
  timeout?: number
  useProxy?: boolean
  proxyConfig?: ProxyConfig
  enabled?: boolean
  priority?: number
}

export interface ProxyConfig {
  host: string
  port?: number
  type?: string
  username?: string
  password?: string
}

export interface DnsConfig {
  upstreamDns: UpstreamDnsConfig[]
  defaultTimeout: number
  retryCount: number
  cacheMaxSize: number
  cacheDefaultTtl: number
  listenPort: number
  cacheEnabled: boolean
  queryLogEnabled: boolean
}

export interface TestUpstreamRequest {
  domain: string
  address: string
  port?: number
  useProxy?: boolean
}

/**
 * 获取 DNS 配置
 */
export async function getDnsConfig(): Promise<DnsConfig> {
  const response = await api.get('/dns/config')
  return response.data
}

/**
 * 更新 DNS 配置
 */
export async function updateDnsConfig(config: Partial<DnsConfig>): Promise<void> {
  await api.put('/dns/config', config)
}

/**
 * 测试上游 DNS
 */
export async function testUpstreamDns(request: TestUpstreamRequest): Promise<any> {
  const response = await api.post('/dns/test-upstream', request)
  return response.data
}

/**
 * 获取缓存统计信息
 */
export async function getCacheStats(): Promise<any> {
  const response = await api.get('/dns/cache/stats')
  return response.data
}

/**
 * 清空缓存
 */
export async function clearCache(): Promise<void> {
  await api.delete('/dns/cache')
}

/**
 * DNS查询结果接口
 */
export interface DnsQueryResult {
  domain: string;
  ipAddresses: string[];
  ttl: number;
  cacheHit: boolean;
  responseTimeMs: number;
  queryTime: string;
  queryType: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * 查询DNS记录（用于前端测试）
 */
export async function queryDns(domain: string): Promise<DnsQueryResult> {
  const response = await api.post('/dns/query', { domain })
  return response.data
}

/**
 * 用户登录
 * @param request 登录请求
 * @returns 登录响应（含token）
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await api.post('/auth/login', request)
  return response.data
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<LoginResponse> {
  const response = await api.get('/auth/current')
  return response.data
}

export default {
  getDnsConfig,
  updateDnsConfig,
  testUpstreamDns,
  getCacheStats,
  clearCache,
  queryDns,
  login,
  logout,
  getCurrentUser
}