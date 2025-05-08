import { StudyCreateDto, StudyResponseDto, ApplicationResponseDto } from '../types'
import { getAuthHeader, removeToken } from './auth'

const API_BASE_URL = 'http://localhost:8080'

// 401 에러 처리
function handleUnauthorized() {
  removeToken()
  window.location.href = '/'
}

// 스터디 목록 조회
export async function getStudies(): Promise<StudyResponseDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies`, {
      headers: {
        ...getAuthHeader()
      }
    })
    if (!response.ok) {
      throw new Error('스터디 목록을 불러오는데 실패했습니다.')
    }
    return await response.json()
  } catch (error) {
    console.error('스터디 목록 조회 에러:', error)
    throw error
  }
}

// 단일 스터디 조회
export async function getStudy(id: string): Promise<StudyResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies/${id}`, {
      headers: {
        ...getAuthHeader()
      }
    })
    if (!response.ok) {
      throw new Error('스터디 정보를 불러오는데 실패했습니다.')
    }
    return await response.json()
  } catch (error) {
    console.error('스터디 조회 에러:', error)
    throw error
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
    })
    if (!response.ok) {
      throw new Error('스터디 생성에 실패했습니다.')
    }
    return await response.json()
  } catch (error) {
    console.error('스터디 생성 에러:', error)
    throw error
  }
}

// 스터디 수정
export async function updateStudy(id: string, study: StudyCreateDto): Promise<StudyResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/studies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(study),
    })
    if (!response.ok) {
      throw new Error('스터디 수정에 실패했습니다.')
    }
    return await response.json()
  } catch (error) {
    console.error('스터디 수정 에러:', error)
    throw error
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
    })
    
    if (response.status === 401) {
      handleUnauthorized()
      throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || '스터디 삭제에 실패했습니다.')
    }
  } catch (error) {
    console.error('스터디 삭제 에러:', error)
    throw error
  }
}

// 스터디 참가
export async function joinStudy(studyId: string, applicantId: number): Promise<ApplicationResponseDto> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader()
  }
  if (typeof (headers as any).Authorization !== 'string') {
    throw new Error('로그인이 필요합니다. 다시 로그인 해주세요.')
  }
  const body = JSON.stringify({
    studyId: Number(studyId),
    applicantId: Number(applicantId),
    status: 'APPROVED'
  })
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/applications/study/${studyId}/apply`, {
      method: 'POST',
      headers,
      body
    })
    if (response.status === 401) {
      throw new Error('로그인이 만료되었습니다. 다시 로그인 해주세요.')
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || '스터디 참가에 실패했습니다.')
    }
    return await response.json()
  } catch (error) {
    console.error('스터디 참가 에러:', error)
    throw error
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
    })
    if (!response.ok) {
      throw new Error('스터디 탈퇴에 실패했습니다.')
    }
    return await response.json()
  } catch (error) {
    console.error('스터디 탈퇴 에러:', error)
    throw error
  }
} 