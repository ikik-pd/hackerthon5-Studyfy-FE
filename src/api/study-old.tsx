import { Study } from "../components/common/types";

const API_BASE_URL = 'http://localhost:8080';

// DTO 타입 정의
export interface StudyCreateDto {
  creatorId: number;
  categoryId: number;
  title: string;
  goal: string;
  description: string;
  maxParticipants: number;
  method: string;
  durationStart: string; // ISO 8601 형식의 날짜 문자열
  durationEnd: string;   // ISO 8601 형식의 날짜 문자열
  deadline: string;      // ISO 8601 형식의 날짜 문자열
}

export interface StudyUpdateDto {
  categoryId?: number;
  title?: string;
  goal?: string;
  description?: string;
  maxParticipants?: number;
  method?: string;
  durationStart?: string; // ISO 8601 형식의 날짜 문자열
  durationEnd?: string;   // ISO 8601 형식의 날짜 문자열
  deadline?: string;      // ISO 8601 형식의 날짜 문자열
}

export interface StudyResponseDto {
  id: number;
  creatorId: number;
  categoryId: number;
  title: string;
  goal: string;
  description: string;
  maxParticipants: number;
  method: string;
  durationStart: string; // ISO 8601 형식의 날짜 문자열
  durationEnd: string;   // ISO 8601 형식의 날짜 문자열
  deadline: string;      // ISO 8601 형식의 날짜 문자열
  createdAt: string;     // ISO 8601 형식의 날짜 문자열
  updatedAt: string;     // ISO 8601 형식의 날짜 문자열
}

// 회원가입 관련 타입 정의
export interface SignupRequest {
  user_name: string;
  password: string;
  email: string;
  gender: 'M' | 'F';
}

export interface SignupResponse {
  id: number;
  userName: string;
  email: string;
  gender: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  deleteStatus: boolean;
}

// 로그인 관련 타입 정의
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

// 인증 헤더 가져오기
function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('token');
  console.log('현재 저장된 토큰:', token);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// 로그인 API
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    console.log('로그인 요청 데이터:', data);
    
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
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('로그인 실패 응답:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData?.message || '로그인에 실패했습니다.');
    }
    
    const result = await response.json();
    console.log('로그인 성공 응답:', result);
    
    if (result.token) {
      localStorage.setItem('token', result.token);
      console.log('JWT 토큰이 저장되었습니다:', result.token);
    } else {
      console.log('응답에 토큰이 없습니다. 응답 데이터:', result);
    }
    
    return result;
  } catch (error) {
    console.error('로그인 에러:', error);
    throw error;
  }
}

// 회원가입 API
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  try {
    console.log('회원가입 요청 데이터:', data);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/member/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('회원가입 실패 응답:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData?.message || '회원가입에 실패했습니다.');
    }
    
    const result = await response.json();
    console.log('회원가입 성공 응답:', result);
    
    // 회원가입 성공 후 자동 로그인
    try {
      const loginResult = await login({
        email: data.email,
        password: data.password
      });
      console.log('자동 로그인 성공:', loginResult);
    } catch (loginError) {
      console.error('자동 로그인 실패:', loginError);
      // 자동 로그인 실패는 회원가입 실패로 처리하지 않음
    }
    
    return result;
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
}

// 토큰 가져오기
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// 토큰 삭제
export function removeToken(): void {
  localStorage.removeItem('token');
}

// 스터디 목록 조회
export async function getStudies(): Promise<StudyResponseDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies`, {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!response.ok) {
      throw new Error('스터디 목록을 불러오는데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('스터디 목록 조회 에러:', error);
    throw error;
  }
}

// 테스트 API
export async function getTest() {
  try {
    const headers = getAuthHeader();
    console.log('요청 헤더:', headers);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/studies`, {
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API 응답 에러:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(errorData?.message || 'API 요청에 실패했습니다.');
    }
    
    const data = await response.json();
    console.log('API 응답 데이터:', data);
    return data;
  } catch (error) {
    console.error('API 요청 에러:', error);
    throw error;
  }
}

// 단일 스터디 조회
export async function getStudy(id: string): Promise<StudyResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies/${id}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!response.ok) {
      throw new Error('스터디 정보를 불러오는데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('스터디 조회 에러:', error);
    throw error;
  }
}

// 스터디 생성
export async function createStudy(study: StudyCreateDto): Promise<StudyResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(study),
    });
    if (!response.ok) {
      throw new Error('스터디 생성에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('스터디 생성 에러:', error);
    throw error;
  }
}

// 스터디 수정
export async function updateStudy(id: string, study: StudyUpdateDto): Promise<StudyResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(study),
    });
    if (!response.ok) {
      throw new Error('스터디 수정에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('스터디 수정 에러:', error);
    throw error;
  }
}

// 스터디 삭제
export async function deleteStudy(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    if (!response.ok) {
      throw new Error('스터디 삭제에 실패했습니다.');
    } 
  } catch (error) {
    console.error('스터디 삭제 에러:', error);
    throw error;
  }
}

// 스터디 참가
export async function joinStudy(id: string, participantId: string): Promise<StudyResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies/${id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ participantId }),
    });
    if (!response.ok) {
      throw new Error('스터디 참가에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('스터디 참가 에러:', error);
    throw error;
  }
}

// 스터디 탈퇴
export async function leaveStudy(id: string, participantId: string): Promise<StudyResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies/${id}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ participantId }),
    });
    if (!response.ok) {
      throw new Error('스터디 탈퇴에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('스터디 탈퇴 에러:', error);
    throw error;
  }
}