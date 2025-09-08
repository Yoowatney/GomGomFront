import type { IDiaryToken, IQuestionerInfo } from '@/types/Answer/types';

import instance from '../api';

const checkDiaryOwner = async (diaryAddress: string): Promise<boolean> => {
  try {
    const api = instance();
    const response = await api.get<boolean>(`/diary/${diaryAddress}/ownership`);
    return response.data;
  } catch (e) {
    console.log('답장 여부 확인 실패', e);
    throw e;
  }
};

const checkHasAlreadyAnswered = async ({
  diaryAddress,
  answererToken,
}: {
  diaryAddress: string;
  answererToken: string;
}): Promise<boolean> => {
  try {
    const api = instance(answererToken);
    const response = await api.get<boolean>(`/diary/${diaryAddress}`);
    return response.data;
  } catch (e) {
    console.log('답장 여부 확인 실패', e);
    throw e;
  }
};

const getQuestionerInfo = async (
  diaryAddress: string,
): Promise<IQuestionerInfo> => {
  try {
    const api = instance();
    const response = await api.get<IQuestionerInfo>(
      `/diary/challenge/${diaryAddress}`,
    );
    return response.data;
  } catch (e) {
    console.log('답장 여부 확인 실패', e);
    throw e;
  }
};

const postCountersign = async ({
  diaryAddress,
  countersign,
}: {
  diaryAddress: string;
  countersign: string;
}): Promise<IDiaryToken> => {
  try {
    const api = instance();
    const response = await api.post<IDiaryToken>(
      `/diary/countersign/${diaryAddress}`,
      { countersign },
    );
    return response.data;
  } catch (e) {
    console.log('답장 여부 확인 실패', e);
    throw e;
  }
};

export {
  checkDiaryOwner,
  checkHasAlreadyAnswered,
  getQuestionerInfo,
  postCountersign,
};
