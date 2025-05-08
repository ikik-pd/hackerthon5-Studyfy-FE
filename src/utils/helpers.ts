export function genId() {
  return Date.now().toString() + Math.floor(Math.random()*1000).toString();
}

export function randomAvatarUrl(name: string) {
  return `https://source.boringavatars.com/marble/40/${encodeURIComponent(name)}?square=false`;
}

export function getRandomNickname() {
  const nicknames = [
    '홍길동','김철수','이영희','박영수','최은지','조민수','한지민','노지훈','정수진','오세라',
    '강나현','윤재현','배영선','임세희','서동건','양지호','문서아','권도희','장성우','민수정',
    '오승주','김예슬','권민지','고승민','서수현'
  ];
  return nicknames[Math.floor(Math.random()*nicknames.length)] || '홍길동';
}

export function getRandomAvatar(nickname: string) {
  // DiceBear의 캐릭터 아바타 사용
  const styles = [
    'adventurer', // 모험가 스타일
    'avataaars', // 아바타 스타일
    'bottts', // 로봇 스타일
    'pixel-art', // 픽셀 아트 스타일
    'personas' // 페르소나 스타일
  ];
  
  // 닉네임을 기반으로 일관된 스타일 선택
  const styleIndex = nickname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
  const style = styles[styleIndex];
  
  // 닉네임을 시드로 사용하여 일관된 아바타 생성
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(nickname)}&backgroundColor=random&radius=50`;
} 