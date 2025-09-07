import type {
  IQuestionInfo,
  IRequirementForAnswer,
} from '@/types/Answer/types';

import instance from '../api';

const getQuestionInfo = async ({
  diaryAddress,
  answererToken,
}: {
  diaryAddress: string;
  answererToken: string;
}): Promise<IQuestionInfo> => {
  try {
    const api = instance(answererToken);
    const response = await api.get<IQuestionInfo>(
      `/diary/question/${diaryAddress}`,
    );
    return response.data;
  } catch (e) {
    console.log('답장 여부 확인 실패', e);
    throw e;
  }
};

const postAnswer = async (data: IRequirementForAnswer): Promise<number> => {
  try {
    const { diaryAddress, answererToken, answerer, answers } = data;
    const api = instance(answererToken);
    const response = await api.post<number>(`diary/answer/${diaryAddress}`, {
      answerer,
      answers,
    });
    return response.status;
  } catch (e) {
    console.log('답장 보내기 실패', e);
    throw e;
  }
};

export { getQuestionInfo, postAnswer };
