export interface Participant {
  id: string;
  nickname: string;
  avatar: string;
}

export interface Study {
  id: number;
  creatorId: number;
  categoryId: number;
  title: string;
  goal: string;
  description: string;
  maxParticipants: number;
  method: string;
  durationStart: string;
  durationEnd: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

export const CATEGORY_OPTIONS = [
  { id: 1, name: '백엔드' },
  { id: 2, name: 'CS' },
  { id: 3, name: '알고리즘' },
  { id: 4, name: '면접' },
  { id: 5, name: '자격증' },
  { id: 6, name: '영어' },
];

export const METHOD_OPTIONS = ['온라인', '오프라인', '혼합']; 