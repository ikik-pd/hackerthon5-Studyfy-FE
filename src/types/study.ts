export interface StudyCreateDto {
  creatorId: number
  categoryId: number
  title: string
  goal: string
  description: string
  max_participants: number
  method: string
  duration_start: string // ISO 8601 형식의 날짜 문자열
  duration_end: string   // ISO 8601 형식의 날짜 문자열
  deadline: string      // ISO 8601 형식의 날짜 문자열
}

export interface StudyUpdateDto {
  categoryId?: number
  title?: string
  goal?: string
  description?: string
  maxParticipants?: number
  method?: string
  durationStart?: string // ISO 8601 형식의 날짜 문자열
  durationEnd?: string   // ISO 8601 형식의 날짜 문자열
  deadline?: string      // ISO 8601 형식의 날짜 문자열
}

export interface StudyResponseDto {
  id: number
  creatorId: number
  categoryId: number
  title: string
  goal: string
  description: string
  maxParticipants: number
  method: string
  durationStart: string // ISO 8601 형식의 날짜 문자열
  durationEnd: string   // ISO 8601 형식의 날짜 문자열
  deadline: string      // ISO 8601 형식의 날짜 문자열
  createdAt: string     // ISO 8601 형식의 날짜 문자열
  updatedAt: string     // ISO 8601 형식의 날짜 문자열
} 