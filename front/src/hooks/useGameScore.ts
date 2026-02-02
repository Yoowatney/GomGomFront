import { useCallback, useEffect, useState } from 'react';

import {
  type GameScoreResponse,
  getGameScores,
  saveGameScore,
} from '@/api/Game/gameScore';

interface UseGameScoreProps {
  diaryId: string;
  answerId: string;
  role: 'owner' | 'answerer';
}

interface UseGameScoreReturn {
  scoreData: GameScoreResponse | null;
  isLoading: boolean;
  isNewRecord: boolean;
  saveScore: (score: number) => Promise<void>;
  getMyBestScore: () => number;
  getOpponentBestScore: () => number;
  getMyNickname: () => string;
  getOpponentNickname: () => string;
}

export const useGameScore = ({
  diaryId,
  answerId,
  role,
}: UseGameScoreProps): UseGameScoreReturn => {
  const [scoreData, setScoreData] = useState<GameScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 점수 조회
  const fetchScores = useCallback(async () => {
    if (!diaryId || !answerId) return;

    setIsLoading(true);
    try {
      const data = await getGameScores(diaryId, answerId);
      setScoreData(data);
    } catch (error) {
      console.error('Failed to fetch game scores:', error);
      // 에러 시 기본값 설정
      setScoreData({
        ownerBestScore: 0,
        answererBestScore: 0,
        ownerNickname: '',
        answererNickname: '',
      });
    } finally {
      setIsLoading(false);
    }
  }, [diaryId, answerId]);

  useEffect(() => {
    void fetchScores();
  }, [fetchScores]);

  // 점수 저장
  const saveScore = useCallback(
    async (score: number) => {
      if (!diaryId || !answerId) return;

      try {
        const response = await saveGameScore({
          diaryId,
          answerId,
          score,
          role,
        });
        setScoreData(response);
        if (response.isNewRecord) {
          setIsNewRecord(true);
        }
      } catch (error) {
        console.error('Failed to save game score:', error);
      }
    },
    [diaryId, answerId, role],
  );

  // 내 최고 점수
  const getMyBestScore = useCallback(() => {
    if (!scoreData) return 0;
    return role === 'owner' ? scoreData.ownerBestScore : scoreData.answererBestScore;
  }, [role, scoreData]);

  // 상대방 최고 점수
  const getOpponentBestScore = useCallback(() => {
    if (!scoreData) return 0;
    return role === 'owner' ? scoreData.answererBestScore : scoreData.ownerBestScore;
  }, [role, scoreData]);

  // 내 닉네임
  const getMyNickname = useCallback(() => {
    if (!scoreData) return '';
    return role === 'owner' ? scoreData.ownerNickname : scoreData.answererNickname;
  }, [role, scoreData]);

  // 상대방 닉네임
  const getOpponentNickname = useCallback(() => {
    if (!scoreData) return '';
    return role === 'owner' ? scoreData.answererNickname : scoreData.ownerNickname;
  }, [role, scoreData]);

  return {
    scoreData,
    isLoading,
    isNewRecord,
    saveScore,
    getMyBestScore,
    getOpponentBestScore,
    getMyNickname,
    getOpponentNickname,
  };
};
