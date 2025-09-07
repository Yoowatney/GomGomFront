import type {
  IChatInfo,
  IChatMessageList,
  IChatNicknames,
  IChatRoomResponse,
  IChatToken,
} from '@/types/Chat/types';

import instance from '../api';

const getChatToken = async (): Promise<IChatToken> => {
  try {
    const api = instance();
    const response = await api.post<IChatToken>('/chat/token');
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const openChat = async (props: IChatInfo): Promise<string> => {
  const { answererId, roomId } = props;
  const api = instance();

  try {
    if (!roomId) {
      const response = await api.post<IChatRoomResponse>('/chat', {
        answererId,
      });
      return response.data._id;
    } else {
      return roomId;
    }
  } catch (e) {
    console.log('채팅방 열기 실패', e);
    throw e;
  }
};

const getNicknames = async (roomId: string): Promise<IChatNicknames> => {
  try {
    const api = instance();
    const response = await api.get<IChatNicknames>(`/chat/${roomId}`);
    return response.data;
  } catch (e) {
    console.log('채팅에서 사용할 닉네임 조회 실패', e);
    throw e;
  }
};

const getPrevMessages = async (roomId: string): Promise<IChatMessageList> => {
  try {
    const api = instance();
    const response = await api.get<IChatMessageList>(
      `/chat/message/${roomId}?take=5`,
    );
    return response.data;
  } catch (e) {
    console.log('이전 메세지 조회 실패', e);
    throw e;
  }
};

const getMessage = async ({
  roomId,
  next,
}: {
  roomId: string;
  next: string;
}): Promise<IChatMessageList> => {
  try {
    const api = instance();
    const response = await api.get<IChatMessageList>(
      `/chat/message/${roomId}?take=5&next=${next}`,
    );

    return response.data;
  } catch (e) {
    console.log('메세지 로드 실패', e);
    throw e;
  }
};

export { getChatToken, getMessage, getNicknames, getPrevMessages, openChat };
