// 로컬스토리지 기반 점수 저장 (1인용)
const STORAGE_KEY = 'gomgom_game_best_score';

// 최고 점수 조회
export const getBestScore = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const score = parseInt(stored, 10);
    if (!isNaN(score)) {
      return score;
    }
  }
  return 0;
};

// 최고 점수 저장 (현재보다 높을 때만)
export const saveBestScore = (score: number): boolean => {
  const currentBest = getBestScore();
  if (score > currentBest) {
    localStorage.setItem(STORAGE_KEY, score.toString());
    return true; // 갱신됨
  }
  return false; // 갱신 안됨
};

/* ====================================================================
   백엔드 API 연동 시 사용할 코드 (1:1 대결 기능)
   ====================================================================

import instance from '@/api/api';
import type { GameScoreData, SaveScoreRequest } from '@/types/Game/types';

const STORAGE_KEY_PREFIX = 'gomgom_game_score_';

const getStorageKey = (diaryAddress: string, answererId: string): string => {
  return `${STORAGE_KEY_PREFIX}${diaryAddress}_${answererId}`;
};

// 점수 조회 (localStorage 기반)
export const getGameScores = async (
  diaryAddress: string,
  answererId: string,
): Promise<GameScoreData> => {
  const key = getStorageKey(diaryAddress, answererId);
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      return JSON.parse(stored) as GameScoreData;
    } catch {
      // 파싱 실패 시 기본값 반환
    }
  }

  return {
    ownerBestScore: 0,
    answererBestScore: 0,
  };
};

// 점수 저장 (localStorage 기반)
export const saveGameScore = async (request: SaveScoreRequest): Promise<void> => {
  const { diaryAddress, answererId, score, role } = request;
  const key = getStorageKey(diaryAddress, answererId);

  const current = await getGameScores(diaryAddress, answererId);

  if (role === 'owner') {
    current.ownerBestScore = Math.max(current.ownerBestScore, score);
  } else {
    current.answererBestScore = Math.max(current.answererBestScore, score);
  }

  localStorage.setItem(key, JSON.stringify(current));
};

// 백엔드 API 버전
export const getGameScoresFromAPI = async (
  diaryAddress: string,
  answererId: string,
): Promise<GameScoreData> => {
  const axiosInstance = instance();
  const response = await axiosInstance.get<GameScoreData>(
    `/api/game/scores/${diaryAddress}/${answererId}`,
  );
  return response.data;
};

export const saveGameScoreToAPI = async (request: SaveScoreRequest): Promise<void> => {
  const axiosInstance = instance();
  await axiosInstance.post('/api/game/scores', request);
};

==================================================================== */
