interface IChatInfo {
  answererId: string;
  roomId?: string;
}

interface IChatRoomResponse {
  _id: string;
}

interface IChatToken {
  chatToken: string;
}

interface IChatNicknames {
  answerer: string;
  questioner: string;
}

interface IChatMessage {
  _id: string;
  clientId: string;
  nickname: string;
  chat: string;
  createdAt: string;
}

type IChatMessageInfo = Pick<IChatMessage, 'nickname' | 'chat' | 'createdAt'>;

interface IChatMessageList {
  messageList: IChatMessage[];
  next: string;
}

interface IChatMessageInfo {
  nickname: string;
  chat: string;
  createdAt: Date;
  isSender?: boolean;
}

export {
  IChatInfo,
  IChatMessage,
  IChatMessageList,
  IChatNicknames,
  IChatRoomResponse,
  IChatToken,
};

export type { IChatMessageInfo };
