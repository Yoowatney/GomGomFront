import instance from '@/api/api';

// 점수 응답 타입
export interface GameScoreResponse {
  ownerBestScore: number;
  answererBestScore: number;
  ownerNickname: string;
  answererNickname: string;
  isNewRecord?: boolean;
}

// 점수 저장 요청 타입
export interface SaveScoreRequest {
  diaryId: string;
  answerId: string;
  score: number;
  role: 'owner' | 'answerer';
}

// 점수 조회
export const getGameScores = async (
  diaryId: string,
  answerId: string,
): Promise<GameScoreResponse> => {
  const axiosInstance = instance();
  const response = await axiosInstance.get<GameScoreResponse>(
    `/game/scores/${diaryId}/${answerId}`,
  );
  return response.data;
};

// 점수 저장
export const saveGameScore = async (
  request: SaveScoreRequest,
): Promise<GameScoreResponse> => {
  const axiosInstance = instance();
  const response = await axiosInstance.post<GameScoreResponse>(
    '/game/scores',
    request,
  );
  return response.data;
};
