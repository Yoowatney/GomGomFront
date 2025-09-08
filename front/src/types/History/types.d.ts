interface IAnswerData {
  answerer: string;
  answers: string[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}

type IAnswerSummary = Omit<IAnswerData, 'answers'>;

interface IHistoryItem {
  _id: string;
  createdAt: string;
  numberOfAnswerers: number;
}

interface IHistoryResponse {
  historyList: IHistoryItem[];
  next: string;
}

interface IHistoryItemDetail {
  _id: string;
  question: string[];
  questioner: string;
  challenge: string;
  answerList: IAnswerData[];
  numberOfAnswerers: number;
  countersign: string;
}

export {
  IAnswerData,
  IAnswerSummary,
  IHistoryItem,
  IHistoryItemDetail,
  IHistoryResponse,
};
