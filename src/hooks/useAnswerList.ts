import { AxiosError, type AxiosInstance } from 'axios';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import instance from '@/api/api';
import { getChatToken, openChat } from '@/api/Chat/chat';
import { getDetailAnswer } from '@/api/Create/detailAnswer';
import { answerAtom } from '@/store/answer';
import { chatTokenAtom, guestAddressAtom, roomIdAtom } from '@/store/chat';
import { questionAtom } from '@/store/create';
import type { IChatInfo } from '@/types/Chat/types';
import { getCookie, setCookie } from '@/util/cookie-helper';

/**
 * 답변자 목록 조회와 페이지네이션 및 정렬
 *
 * @param diaryId 다이어리의 고유 주소
 * @param initialSortOrder 초기 정렬 순서 ('desc' 또는 'asc'). 기본값 'desc'
 * @param itemsPerPage 페이지당 표시할 항목 수. 기본값 5.
 * @returns 답변자 목록, 개수, 연결 상태, 페이지네이션 및 정렬 관련 함수와 상태를 포함하는 객체
 */

export interface Answerer {
  _id: string;
  answerer: string;
  roomId?: string;
}

const useAnswerList = (
  diaryId: string,
  itemsPerPage: number = 5,
) => {
  const axiosInstance: AxiosInstance = useMemo(() => instance(), []);
  const navigate = useNavigate();

  const [, setQuestion] = useAtom(questionAtom);
  const [, setAnswer] = useAtom(answerAtom);
  const [, setChatToken] = useAtom(chatTokenAtom);
  const [, setRoomId] = useAtom(roomIdAtom);
  const [, setGuestAddress] = useAtom(guestAddressAtom);

  const [answererList, setAnswererList] = useState<Answerer[]>([]);
  const [answererCount, setAnswerCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chatNotAllow, setChatNotAllow] = useState<boolean>(false);
  const [chatCreated, setChatCreated] = useState<boolean>(false);
  const [chatCreationError, setChatCreationError] = useState<boolean>(false);
  const [chatOwnerRequired, setChatOwnerRequired] = useState<boolean>(false);

  const totalPages: number = Math.ceil(answererCount / itemsPerPage);
  const pageRange: number = 5;

  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const resetChatNotAllow = useCallback(() => {
    setChatNotAllow(false);
  }, []);

  const resetChatCreated = useCallback(() => {
    setChatCreated(false);
  }, []);

  const resetChatCreationError = useCallback(() => {
    setChatCreationError(false);
  }, []);

  const resetChatOwnerRequired = useCallback(() => {
    setChatOwnerRequired(false);
  }, []);

  useEffect(() => {
    const start: number = (currentPage - 1) * itemsPerPage;
    axiosInstance
      .get<{ answererList: Answerer[]; answerCount: number }>(
        `diary/answerers/${diaryId}/?start=${start}&take=${itemsPerPage}&sortOrder=${sortOrder}`,
      )
      .then((response) => {
        if (response.status === 200) {
          setIsConnected(true);
          setAnswererList(response.data.answererList);
          setAnswerCount(response.data.answerCount);
        }
      })
      .catch((e: AxiosError) => {
        console.error('Failed to fetch answerers:', e);
        setIsConnected(false);
      });
  }, [axiosInstance, currentPage, diaryId, itemsPerPage, sortOrder]);

  const handlePageClick = useCallback(
    (pageNumber: number): void => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages],
  );

  const generatePageNumbers = useCallback((): number[] => {
    const pageNumbers: number[] = [];
    const totalPagesToShow: number = Math.min(pageRange, totalPages);
    const currentPageGroup: number = Math.ceil(currentPage / totalPagesToShow);
    const firstPageInGroup: number =
      (currentPageGroup - 1) * totalPagesToShow + 1;
    let endPage: number = currentPageGroup * totalPagesToShow;

    if (endPage > totalPages) {
      endPage = totalPages;
    }

    for (let i = firstPageInGroup; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }, [currentPage, totalPages, pageRange]);

  const handleSelectSortOrder = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setCurrentPage(1);
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  const handleDisplayResponse = useCallback(
    async (answererId: string) => {
      try {
        const diaryAddressCookie = getCookie('diaryAddress');
        const diaryUserCookie = getCookie('diaryUser');

        if (!diaryAddressCookie || !diaryUserCookie) {
          if (diaryId) {
            setCookie('diaryAddress', diaryId);
          }
        }

        const answerData = await getDetailAnswer(diaryId, answererId);

        setAnswer(answerData.answer);
        setQuestion(answerData.question);

        void navigate(`/answer/${diaryId}/${answererId}`);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 401) {
            setError('UNAUTHORIZED');
            return;
          }
        }
      }
    },
    [diaryId, navigate, setAnswer, setQuestion],
  );

  const handleOpenChat = async (props: IChatInfo): Promise<void> => {
    const { answererId, roomId } = props;

    try {
      const token = await getChatToken();
      setChatToken(token.chatToken);

      if (roomId) {
        setRoomId(roomId);
        setGuestAddress(answererId);
        void navigate('/chat/enter_room');
        return;
      }

      const newRoomId = await openChat({ answererId, roomId });
      if (newRoomId) {
        setAnswererList((prevList) =>
          prevList.map((answerer) =>
            answerer._id === answererId
              ? { ...answerer, roomId: newRoomId }
              : answerer,
          ),
        );
        setChatCreated(true);
      }
    } catch (error) {
      console.error('Error fetching chat token or opening chat:', error);
      if (error instanceof AxiosError && error.response?.status === 403) {
        setChatOwnerRequired(true);
      } else {
        setChatCreationError(true);
      }
    }
  };

  return {
    answererList,
    answererCount,
    isConnected,
    currentPage,
    totalPages,
    handlePageClick,
    generatePageNumbers,
    handleSelectSortOrder,
    sortOrder,
    handleDisplayResponse,
    error,
    resetError,
    chatNotAllow,
    resetChatNotAllow,
    chatCreated,
    resetChatCreated,
    chatCreationError,
    resetChatCreationError,
    chatOwnerRequired,
    resetChatOwnerRequired,
    handleOpenChat,
  };
};

export default useAnswerList;
