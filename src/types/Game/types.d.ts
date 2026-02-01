// 하트 레벨 (0~12)
export type HeartLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// 하트 정보
export interface HeartConfig {
  level: HeartLevel;
  radius: number;
  color: string;
  emoji: string;
  score: number;
  image: string; // twemoji SVG URL
}

// 게임 설정
export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  wallThickness: number;
  gameOverLineY: number;
  dropAreaY: number;
  gravity: number;
  maxSpawnLevel: HeartLevel;
}

// 게임 상태
export interface GameStateData {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  currentHeartLevel: HeartLevel;
  nextHeartLevel: HeartLevel;
  isWarning: boolean;
}

// 점수 데이터
export interface GameScoreData {
  ownerBestScore: number;
  answererBestScore: number;
}

// 점수 저장 요청
export interface SaveScoreRequest {
  diaryAddress: string;
  answererId: string;
  score: number;
  role: 'owner' | 'answerer';
}

// 게임 역할
export type GameRole = 'owner' | 'answerer';

// 게임 페이지 파라미터
export interface GamePageParams {
  diaryAddress: string;
  answererId: string;
}

// 하트 바디 확장 (Matter.js Body에 추가 속성)
export interface HeartBodyLabel {
  type: 'heart';
  level: HeartLevel;
}

// 파티클 타입
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'star' | 'heart';
}
