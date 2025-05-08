import { StudyCreateDto, StudyUpdateDto, StudyResponseDto } from '../types'
import { getAuthHeader } from './auth'

const API_BASE_URL = 'http://localhost:8080'

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
export async function updateStudy(id: string, study: StudyUpdateDto): Promise<StudyResponseDto> {
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
    if (!response.ok) {
      throw new Error('스터디 삭제에 실패했습니다.')
    } 
  } catch (error) {
    console.error('스터디 삭제 에러:', error)
    throw error
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
    })
    if (!response.ok) {
      throw new Error('스터디 참가에 실패했습니다.')
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