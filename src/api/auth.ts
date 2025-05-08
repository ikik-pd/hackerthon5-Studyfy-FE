import { SignupRequest, SignupResponse, LoginRequest, LoginResponse, MemberDto } from '../types'

const API_BASE_URL = 'http://localhost:8080'

// 인증 헤더 가져오기
export function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('token')
  console.log('현재 저장된 토큰:', token)
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// 토큰 가져오기
export function getToken(): string | null {
  return localStorage.getItem('token')
}

// 토큰 삭제
export function removeToken(): void {
  localStorage.removeItem('token')
}

// 로그인 API
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    console.log('로그인 요청 데이터:', data)
    
    const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('로그인 실패 응답:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData?.message || '로그인에 실패했습니다.')
    }
    
    const result = await response.json()
    console.log('로그인 성공 응답:', result)
    
    if (result.token) {
      localStorage.setItem('token', result.token)
      console.log('JWT 토큰이 저장되었습니다:', result.token)
    } else {
      console.log('응답에 토큰이 없습니다. 응답 데이터:', result)
    }
    
    return result
  } catch (error) {
    console.error('로그인 에러:', error)
    throw error
  }
}

// 회원가입 API
export async function signup(data: MemberDto): Promise<SignupResponse> {
  try {
    
    const response = await fetch(`${API_BASE_URL}/api/v1/member/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('회원가입 실패 응답:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData?.message || '회원가입에 실패했습니다.')
    }
    
    const result = await response.json()
    console.log('회원가입 성공 응답:', result)
    
    // 회원가입 성공 후 자동 로그인
    try {
      const loginResult = await login({
        email: data.email,
        password: data.password
      })
      console.log('자동 로그인 성공:', loginResult)
    } catch (loginError) {
      console.error('자동 로그인 실패:', loginError)
      // 자동 로그인 실패는 회원가입 실패로 처리하지 않음
    }
    
    return result
  } catch (error) {
    console.error('회원가입 에러:', error)
    throw error
  }
} 