import instance from '../api';

export const hasDiary = async (): Promise<boolean> => {
  try {
    const api = instance();
    const response = await api.get<boolean>('/diary');
    return response.data;
  } catch (e) {
    console.log('다이어리 생성 여부 조회 실패', e);
    throw e;
  }
};
