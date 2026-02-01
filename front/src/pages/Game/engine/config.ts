import type { GameConfig, HeartConfig, HeartLevel } from '@/types/Game/types';

// 게임 설정 (0.7 스케일 - PC/모바일 균형)
export const GAME_CONFIG: GameConfig = {
  canvasWidth: 420,
  canvasHeight: 630,
  wallThickness: 14,
  gameOverLineY: 105,
  dropAreaY: 56,
  gravity: 2.5,
  maxSpawnLevel: 5, // 드롭 시 생성 가능한 최대 레벨 (0~5)
};

// 하트 데이터 (레벨 0~12, 0.7 스케일)
// twemoji SVG 이미지 사용
export const HEARTS: Record<HeartLevel, HeartConfig> = {
  0: {
    level: 0,
    radius: 20,
    color: '#FFFFFF',
    emoji: '🤍',
    score: 1,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f90d.svg',
  },
  1: {
    level: 1,
    radius: 25,
    color: '#B0B0B0',
    emoji: '🩶',
    score: 2,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1fa76.svg',
  },
  2: {
    level: 2,
    radius: 29,
    color: '#4A4A4A',
    emoji: '🖤',
    score: 4,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f5a4.svg',
  },
  3: {
    level: 3,
    radius: 33,
    color: '#8B5A3C',
    emoji: '🤎',
    score: 7,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f90e.svg',
  },
  4: {
    level: 4,
    radius: 37,
    color: '#9370DB',
    emoji: '💜',
    score: 11,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f49c.svg',
  },
  5: {
    level: 5,
    radius: 41,
    color: '#87CEEB',
    emoji: '🩵',
    score: 16,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1fa75.svg',
  },
  6: {
    level: 6,
    radius: 47,
    color: '#4169E1',
    emoji: '💙',
    score: 22,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f499.svg',
  },
  7: {
    level: 7,
    radius: 50,
    color: '#32CD32',
    emoji: '💚',
    score: 29,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f49a.svg',
  },
  8: {
    level: 8,
    radius: 55,
    color: '#FFD700',
    emoji: '💛',
    score: 37,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f49b.svg',
  },
  9: {
    level: 9,
    radius: 58,
    color: '#FFA500',
    emoji: '🧡',
    score: 46,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f9e1.svg',
  },
  10: {
    level: 10,
    radius: 63,
    color: '#FF69B4',
    emoji: '🩷',
    score: 56,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1fa77.svg',
  },
  11: {
    level: 11,
    radius: 68,
    color: '#FF0000',
    emoji: '❤️',
    score: 67,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/2764.svg',
  },
  12: {
    level: 12,
    radius: 72,
    color: '#FF1493',
    emoji: '💗',
    score: 79,
    image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f497.svg',
  },
};

// 레벨별 하트 이미지 URL
export const getHeartImageUrl = (level: HeartLevel): string => {
  return HEARTS[level].image;
};

// 다음 드롭할 하트 레벨 랜덤 생성 (0~maxSpawnLevel)
export const getRandomSpawnLevel = (): HeartLevel => {
  const max = GAME_CONFIG.maxSpawnLevel;
  return Math.floor(Math.random() * (max + 1)) as HeartLevel;
};

// 병합 후 다음 레벨 (12이면 유지)
export const getNextLevel = (level: HeartLevel): HeartLevel => {
  if (level >= 12) return 12;
  return (level + 1) as HeartLevel;
};

// 최대 레벨인지 확인
export const isMaxLevel = (level: HeartLevel): boolean => {
  return level >= 12;
};
