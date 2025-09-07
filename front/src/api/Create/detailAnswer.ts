import type { IDetailAnswer } from '@/types/Create/types';

import instance from '../api';

export const getDetailAnswer = async (
  diaryAddress: string,
  answererId: string,
): Promise<IDetailAnswer> => {
  try {
    const api = instance();
    const response = await api.get<IDetailAnswer>(
      `/diary/answer/${diaryAddress}/${answererId}`,
    );
    return response.data;
  } catch (e) {
    console.log('답변 상세 조회 실패', e);
    throw e;
  }
};
