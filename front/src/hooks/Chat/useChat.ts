import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import { getMessage, getNicknames, getPrevMessages } from '@/api/Chat/chat';
import { useModal } from '@/hooks/useModal';
import { chatTokenAtom, guestAddressAtom, roomIdAtom } from '@/store/chat';
import type { IChatMessage, IChatNicknames } from '@/types/Chat/types';
import { getCookie } from '@/util/cookie-helper';
import { checkContainsBadwords } from '@/util/string-helper';

interface ExtendedChatMessage extends IChatMessage {
  isSender?: boolean;
}

interface SocketMessage {
  chat: string;
  nickname: string;
  createdAt: Date;
}

export const useChat = () => {
  const { isOpen, modalContent, openModal, closeModal } = useModal();
  const chatToken = useAtomValue(chatTokenAtom);
  const roomId = useAtomValue(roomIdAtom);
  const guestAddress = useAtomValue(guestAddressAtom);
  const diaryAddress = getCookie('diaryAddress');
  const navigate = useNavigate();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [isEnter, setIsEnter] = useState<boolean>(false);

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
    const initializeSocket = async () => {
      try {
        const header = {
          authorization: `Bearer ${chatToken}`,
          roomid: `${roomId}`,
        };

        const newSocket = io(`${import.meta.env.VITE_APP_CHAT_WS}`, {
          extraHeaders: {
            ...header,
          },
        });

        newSocket.on('connect', () => {
          setSocket(newSocket);
        });

        newSocket.on('exception', (error: any) => {
          console.error('Socket 에러 발생:', error);
        });

        newSocket.on('disconnect', () => {
          console.log('Socket 연결 끊어짐');
          void navigate(-1);
        });

        await initializeNicknames();

        return () => {
          if (newSocket) {
            newSocket.disconnect();
          }
        };
      } catch (error) {
        console.error('Socket 초기화 실패:', error);
      }
    };

    void initializeSocket();
  }, [roomId, chatToken, navigate, initializeNicknames]);

  useEffect(() => {
    if (!socket) return;

    socket.on('ready', () => {
      socket.emit('enter_room', { roomId });
      setIsEnter(true);
    });

    if (isEnter) {
      socket.on('receive_message', (socketMessage: SocketMessage) => {
        const myNickname =
          guestAddress === diaryAddress ? answerer : questioner;
        if (socketMessage.nickname === myNickname) return;

        const newMessage: ExtendedChatMessage = {
          _id: Date.now().toString(),
          clientId: '',
          chat: socketMessage.chat,
          nickname: socketMessage.nickname,
          createdAt: new Date().toISOString(),
          isSender: false,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      socket.off('ready');
      socket.off('receive_message');
    };
  }, [
    answerer,
    diaryAddress,
    guestAddress,
    isEnter,
    questioner,
    roomId,
    socket,
  ]);

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

      // 스크롤 위치 유지
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

  // 초기 로드 후 더 많은 메시지가 있는지 확인하고 자동으로 로드
  const checkAndLoadMoreIfNeeded = useCallback(async () => {
    if (!initialLoadComplete || isEnd || fetching) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    // 컨테이너가 스크롤 가능한지 확인
    const hasScroll = container.scrollHeight > container.clientHeight;

    // 스크롤이 없고 더 불러올 메시지가 있다면 자동으로 더 로드
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
    // 초기 메시지 로드 완료 후 확인
    if (initialLoadComplete) {
      const timeoutId = setTimeout(() => {
        void checkAndLoadMoreIfNeeded();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [initialLoadComplete, saveMessages, checkAndLoadMoreIfNeeded]);

  // Scroll handling
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;

      // 맨 위에서 스크롤할 때 또는 스크롤이 거의 맨 위에 있을 때
      if (scrollTop <= 10 && !fetching && !isEnd && originNext) {
        void fetchMoreMessages();
      }
    }
  }, [fetching, isEnd, originNext, fetchMoreMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 새로운 메시지가 추가될 때만 맨 아래로 스크롤 (기존 메시지 로드 시는 제외)
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  const handleMessageSend = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!socket || message.trim() === '' || e.key !== 'Enter') return;

      const nickname = guestAddress === diaryAddress ? answerer : questioner;

      if (!nickname) return;

      if (message.length > 100) {
        setIsScaleover(true);
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

      socket.emit('send_message', {
        roomId,
        chat: message,
        nickname,
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      scrollToBottom();
    },
    [
      socket,
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
