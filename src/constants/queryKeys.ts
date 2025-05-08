export const QUERY_KEYS = {
  STUDIES: 'studies',
  STUDY: 'study',
  USER: 'user',
  AUTH: 'auth',
} as const

export const getStudyQueryKey = (id: string) => [QUERY_KEYS.STUDY, id] as const 