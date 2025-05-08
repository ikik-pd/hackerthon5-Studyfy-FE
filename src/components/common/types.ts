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
  { id: 1, name: '프론트엔드' },
  { id: 2, name: '알고리즘' },
  { id: 3, name: '영어' },
];

export const METHOD_OPTIONS = ['온라인', '오프라인', '혼합']; 