import type { Body } from 'matter-js';

import type { HeartLevel } from '@/types/Game/types';

// 하트 바디 타입 (Matter.js Body 확장)
export interface HeartBody extends Body {
  label: string;
  heartLevel?: HeartLevel;
  isMerging?: boolean;
  createdAt?: number;
  scale?: number; // 바운스 애니메이션용 스케일
  isNext?: boolean; // 다음 하트 (드롭 전 미리보기)
}

// 게임 이벤트 콜백
export interface GameCallbacks {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
  onHeartMerge: (level: HeartLevel, x: number, y: number) => void;
  onHeartDrop: () => void;
  onHeartLand: () => void;
}

// 입력 상태
export interface InputState {
  mouseX: number;
  isPointerDown: boolean;
  canDrop: boolean;
}

// 렌더러 옵션
export interface RendererOptions {
  showGameOverLine: boolean;
  showNextHeart: boolean;
}
