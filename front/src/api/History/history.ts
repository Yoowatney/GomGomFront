import type {
  IHistoryItemDetail,
  IHistoryResponse,
} from '@/types/History/types';

import instance from '../api';

const getHistoryDiary = async (): Promise<IHistoryResponse> => {
  try {
    const api = instance();
    const response = await api.get<IHistoryResponse>(`/history?take=5`);
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getNextHistoryDiary = async (next: string): Promise<IHistoryResponse> => {
  try {
    const api = instance();
    const response = await api.get<IHistoryResponse>(
      `/history?next=${next}&take=5`,
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getHistoryItemDetail = async (
  currentPage: number,
  historyItemId: string,
): Promise<IHistoryItemDetail> => {
  try {
    const api = instance();
    const response = await api.get<IHistoryItemDetail>(
      `/history/${historyItemId}?take=5&start=${(currentPage - 1) * 5}`,
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export { getHistoryDiary, getHistoryItemDetail, getNextHistoryDiary };
