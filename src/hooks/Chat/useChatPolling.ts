import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getMessage,
  getNicknames,
  getPrevMessages,
  pollMessages,
  sendMessageApi,
} from '@/api/Chat/chat';
import { useModal } from '@/hooks/useModal';
import { guestAddressAtom, roomIdAtom } from '@/store/chat';
import type { IChatMessage, IChatNicknames } from '@/types/Chat/types';
import { getCookie } from '@/util/cookie-helper';
import { checkContainsBadwords } from '@/util/string-helper';

interface ExtendedChatMessage extends IChatMessage {
  isSender?: boolean;
}

const POLLING_INTERVAL = 3000;

export const useChatPolling = () => {
  const { isOpen, modalContent, openModal, closeModal } = useModal();
  const roomId = useAtomValue(roomIdAtom);
  const guestAddress = useAtomValue(guestAddressAtom);
  const diaryAddress = getCookie('diaryAddress');

  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);

  const [questioner, setQuestioner] = useState<string>('');
  const [answerer, setAnswerer] = useState<string>('');

  const [saveMessages, setSaveMessages] = useState<ExtendedChatMessage[]>([]);
  const [originNext, setOriginNext] = useState<string>('');
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const [isScaleover, setIsScaleover] = useState<boolean>(false);
  const [initialLoadComplete, setInitialLoadComplete] =
    useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastServerTimeRef = useRef<string>(new Date().toISOString());

  // 닉네임 초기화
  const initializeNicknames = useCallback(async () => {
    try {
      const nicknames: IChatNicknames = await getNicknames(roomId);
      setAnswerer(nicknames.answerer);
      setQuestioner(nicknames.questioner);
    } catch (error) {
      console.error('닉네임 초기화 실패:', error);
    }
  }, [roomId]);

  useEffect(() => {
    void initializeNicknames();
  }, [initializeNicknames]);

  // 폴링 루프
  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      try {
        const { messages: newMsgs, serverTime } = await pollMessages(
          roomId,
          lastServerTimeRef.current,
        );
        if (newMsgs.length > 0) {
          const received = newMsgs.filter(
            (m: ExtendedChatMessage) => !m.isSender,
          );
          if (received.length > 0) {
            setMessages((prev) => [...prev, ...received]);
          }
        }
        lastServerTimeRef.current = serverTime;
      } catch (e) {
        console.error('폴링 실패:', e);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [roomId]);

  // 초기 메시지 로드
  const fetchOriginMessages = useCallback(async () => {
    try {
      const loadMessage = await getPrevMessages(roomId);

      if (loadMessage.messageList.length === 0) {
        setIsEnd(true);
      } else {
        setSaveMessages(loadMessage.messageList);
        setOriginNext(loadMessage.next);
        setLoading(true);
      }
      setInitialLoadComplete(true);
    } catch (error) {
      console.error('초기 메시지 로딩 실패:', error);
      setIsEnd(true);
      setInitialLoadComplete(true);
    }
  }, [roomId]);

  useEffect(() => {
    void fetchOriginMessages();
  }, [fetchOriginMessages]);

  // 추가 메시지 로드
  const fetchNextMessages = useCallback(
    async (next: string): Promise<IChatMessage[]> => {
      if (!next) return [];

      try {
        const nextMessages = await getMessage({ roomId, next });
        setOriginNext(nextMessages.next);
        return nextMessages.messageList;
      } catch (error) {
        console.error('추가 메시지 로딩 실패:', error);
        return [];
      }
    },
    [roomId],
  );

  const fetchMoreMessages = useCallback(async () => {
    if (fetching) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const previousScrollHeight = container.scrollHeight;

    setFetching(true);
    const nextMessagesList = await fetchNextMessages(originNext);

    if (nextMessagesList.length > 0) {
      setSaveMessages((prev) => [...nextMessagesList, ...prev]);
      setIsEnd(false);

      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        }
      }, 0);
    } else {
      setIsEnd(true);
    }

    setFetching(false);
  }, [fetching, originNext, fetchNextMessages]);

  const checkAndLoadMoreIfNeeded = useCallback(async () => {
    if (!initialLoadComplete || isEnd || fetching) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const hasScroll = container.scrollHeight > container.clientHeight;

    if (!hasScroll && originNext && saveMessages.length > 0) {
      await fetchMoreMessages();
    }
  }, [
    initialLoadComplete,
    isEnd,
    fetching,
    originNext,
    saveMessages.length,
    fetchMoreMessages,
  ]);

  useEffect(() => {
    if (initialLoadComplete) {
      const timeoutId = setTimeout(() => {
        void checkAndLoadMoreIfNeeded();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [initialLoadComplete, saveMessages, checkAndLoadMoreIfNeeded]);

  // 스크롤 처리
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;

      if (scrollTop <= 10 && !fetching && !isEnd && originNext) {
        void fetchMoreMessages();
      }
    }
  }, [fetching, isEnd, originNext, fetchMoreMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  // 메시지 전송 (REST API)
  const handleMessageSend = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (message.trim() === '' || e.key !== 'Enter') return;

      const nickname = guestAddress === diaryAddress ? answerer : questioner;

      if (!nickname) return;

      if (message.length > 100) {
        setIsScaleover(true);
        return;
      }

      if (checkContainsBadwords(message)) {
        openModal({
          title: '⚠️ 경고',
          description:
            '부적절한 단어가 포함되어 있습니다.\n 다시 입력해주세요. :)',
          onConfirmCallback: () => {
            setMessage('');
            closeModal();
          },
        });
        return;
      }

      const newMessage: ExtendedChatMessage = {
        _id: Date.now().toString(),
        clientId: '',
        nickname,
        chat: message,
        createdAt: new Date().toISOString(),
        isSender: true,
      };

      try {
        await sendMessageApi(roomId, message, nickname);
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
        scrollToBottom();
      } catch {
        console.error('메시지 전송에 실패했습니다.');
      }
    },
    [
      message,
      guestAddress,
      diaryAddress,
      answerer,
      questioner,
      roomId,
      scrollToBottom,
      openModal,
      closeModal,
    ],
  );

  const handleMessageInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    [],
  );

  const handleScaleoverModalClose = useCallback(() => {
    setIsScaleover(false);
  }, []);

  return {
    message,
    messages,
    saveMessages,
    isEnd,
    loading,
    isScaleover,
    scrollContainerRef,
    handleMessageInput,
    handleMessageSend,
    handleScaleoverModalClose,
    handleScroll,
    initialLoadComplete,
    isOpen,
    modalContent,
    closeModal,
  };
};
