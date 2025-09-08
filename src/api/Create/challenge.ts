import instance from '../api';

interface IChallengeData {
  question: string[];
  questioner: string;
  challenge: string;
  countersign: string;
}

export const createDiary = async (data: IChallengeData): Promise<number> => {
  try {
    const api = instance();
    const response = await api.post<string>('/diary/question', data);
    return response.status;
  } catch (e) {
    console.log('다이어리 생성 실패', e);
    throw e;
  }
};
