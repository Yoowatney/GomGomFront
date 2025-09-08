interface IAnswerData {
  answerer: string;
  answers: string[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface IQuestionData {
  question: string[];
  questioner: string;
  _id: string;
}

interface IDetailAnswer {
  answer: IAnswerData;
  question: IQuestionData;
}

export { IAnswerData, IDetailAnswer, IQuestionData };
