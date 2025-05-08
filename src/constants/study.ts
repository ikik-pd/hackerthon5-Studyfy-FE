export const STUDY_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
} as const

export const STUDY_STATUS_LABEL = {
  [STUDY_STATUS.NOT_STARTED]: '시작 전',
  [STUDY_STATUS.IN_PROGRESS]: '진행 중',
  [STUDY_STATUS.FINISHED]: '완료',
} as const

export const STUDY_BUTTON_LABEL = {
  JOIN: '참여하기',
  LEAVE: '탈퇴하기',
  DELETE: '삭제',
  PROCESSING: '처리중...',
  FULL: '모집 마감',
  FINISHED: '종료된 스터디',
} as const

export const MODAL_DURATION = 2000 // 2초 