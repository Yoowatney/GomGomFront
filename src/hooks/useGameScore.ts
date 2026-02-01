import { useCallback, useEffect, useState } from 'react';

import { getBestScore, saveBestScore } from '@/api/Game/gameScore';

interface UseGameScoreReturn {
  bestScore: number;
  saveScore: (score: number) => boolean;
  isNewRecord: boolean;
  resetNewRecord: () => void;
}

export const useGameScore = (): UseGameScoreReturn => {
  const [bestScore, setBestScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // 초기 로드
  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  // 점수 저장 (최고 점수보다 높을 때만 갱신)
  const saveScore = useCallback((score: number): boolean => {
    const updated = saveBestScore(score);
    if (updated) {
      setBestScore(score);
      setIsNewRecord(true);
    }
    return updated;
  }, []);

  const resetNewRecord = useCallback(() => {
    setIsNewRecord(false);
  }, []);

  return {
    bestScore,
    saveScore,
    isNewRecord,
    resetNewRecord,
  };
};

/* ====================================================================
   백엔드 API 연동 시 사용할 코드 (1:1 대결 기능)
   ====================================================================

import { useCallback, useEffect, useState } from 'react';

import { getGameScores, saveGameScore } from '@/api/Game/gameScore';
import type { GameRole, GameScoreData } from '@/types/Game/types';

interface UseGameScoreProps {
  diaryAddress: string;
  answererId: string;
  role: GameRole;
}

interface UseGameScoreReturn {
  scoreData: GameScoreData;
  isLoading: boolean;
  saveScore: (score: number) => Promise<void>;
  refetch: () => Promise<void>;
  getMyBestScore: () => number;
  getOpponentBestScore: () => number;
}

export const useGameScore = ({
  diaryAddress,
  answererId,
  role,
}: UseGameScoreProps): UseGameScoreReturn => {
  const [scoreData, setScoreData] = useState<GameScoreData>({
    ownerBestScore: 0,
    answererBestScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    if (!diaryAddress || !answererId) return;

    setIsLoading(true);
    try {
      const data = await getGameScores(diaryAddress, answererId);
      setScoreData(data);
    } catch (error) {
      console.error('Failed to fetch game scores:', error);
    } finally {
      setIsLoading(false);
    }
  }, [diaryAddress, answererId]);

  useEffect(() => {
    void fetchScores();
  }, [fetchScores]);

  const saveScore = useCallback(
    async (score: number) => {
      if (!diaryAddress || !answererId) return;

      try {
        await saveGameScore({
          diaryAddress,
          answererId,
          score,
          role,
        });
        await fetchScores();
      } catch (error) {
        console.error('Failed to save game score:', error);
      }
    },
    [diaryAddress, answererId, role, fetchScores],
  );

  const getMyBestScore = useCallback(() => {
    return role === 'owner' ? scoreData.ownerBestScore : scoreData.answererBestScore;
  }, [role, scoreData]);

  const getOpponentBestScore = useCallback(() => {
    return role === 'owner' ? scoreData.answererBestScore : scoreData.ownerBestScore;
  }, [role, scoreData]);

  return {
    scoreData,
    isLoading,
    saveScore,
    refetch: fetchScores,
    getMyBestScore,
    getOpponentBestScore,
  };
};

==================================================================== */
