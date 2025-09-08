import type { IChatInfo } from '../Chat/types';

interface IQuestionerInfo {
  _id: string;
  questioner: string;
  challenge: string;
}

interface IDiaryToken {
  diaryToken: string;
}

interface IQuestionInfo {
  _id: string;
  question: string[];
  questionLength: number;
}

interface IRequirementForAnswer {
  diaryAddress: string;
  answerer: string;
  answers: string[];
  answererToken: string;
}

interface IAnswerer {
  _id: string;
  answerer: string;
  roomId?: string;
}

interface IAnswerListSection {
  answererList: IAnswerer[];
  answererCount: number;
  currentPage: number;
  totalPages: number;
  correctAnswerer: string | undefined;
  diaryId: string;
  sortOrder: 'desc' | 'asc';
  isDiaryOwner: boolean;
  error: string | null;
  generatePageNumbers: () => number[];
  handleSelectSortOrder: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePageClick: (pageNumber: number) => void;
  handleDisplayResponse: (answererId: string) => Promise<void>;
  handleOpenChat: (props: IChatInfo) => Promise<void>;
}

interface IAnswererClassName {
  userId: string;
  correctAnswerer: string | undefined;
  diaryId: string | undefined;
  Style: CSSModuleClasses;
}

interface IChatIcon {
  user: IAnswerer;
  correctAnswerer: string | undefined;
  diaryId: string | undefined;
}

export {
  IAnswerer,
  IAnswererClassName,
  IAnswerListSection,
  IChatIcon,
  IDiaryToken,
  IQuestionerInfo,
  IQuestionInfo,
  IRequirementForAnswer,
};
