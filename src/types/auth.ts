export interface SignupRequest {
  user_name: string
  password: string
  email: string
  gender: 'M' | 'F'
}

export interface SignupResponse {
  id: number
  userName: string
  email: string
  gender: 'M' | 'F'
  password: string
  createdAt: string
  updatedAt: string
  deleteStatus: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  id: number
  userName: string
  email: string
  gender: 'M' | 'F'
}

export interface User {
  id: number
  name: string
  email: string
  gender: 'M' | 'F'
} 