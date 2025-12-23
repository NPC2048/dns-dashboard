// 后端LoginResponse的对应
export interface User {
  username: string
  isAdmin: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  isAdmin: boolean
}

// 后端SaResult的对应（错误响应）
export interface SaResult<T = any> {
  code: number  // 500 表示错误
  msg: string
  data: T | null
}