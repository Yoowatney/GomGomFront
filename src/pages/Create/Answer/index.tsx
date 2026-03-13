import { AxiosError } from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import instance from '@/api/api';
import { getChatToken, openChat } from '@/api/Chat/chat';
import Button from '@/components/Button';
import CustomModal from '@/components/Modal/CustomModal';
import { useModal } from '@/hooks/useModal';
import { answerAtom, selectedAnswererAtom } from '@/store/answer';
import { chatTokenAtom, guestAddressAtom, roomIdAtom } from '@/store/chat';
import { questionAtom } from '@/store/create';
import type { IAnswerer } from '@/types/Answer/types';
import { getCookie } from '@/util/cookie-helper';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const Answer = () => {
  const answerData = useAtomValue(answerAtom);
  const questionData = useAtomValue(questionAtom);
  const [selectedAnswerer, setSelectedAnswerer] = useAtom(selectedAnswererAtom);
  const navigate = useNavigate();
  const { diaryAddress, answererId } = useParams();

  const [, setChatToken] = useAtom(chatTokenAtom);
  const [, setRoomId] = useAtom(roomIdAtom);
  const [, setGuestAddress] = useAtom(guestAddressAtom);
  const { openModal, isOpen, modalContent, closeModal } = useModal();

  const correctAnswerer = getCookie('diaryAddress');
  const isDiaryOwner = correctAnswerer === diaryAddress;
  const isMyAnswer = answererId === correctAnswerer;
  const canShowActions = isDiaryOwner || isMyAnswer;

  const roomId = selectedAnswerer?.roomId;

  useEffect(() => {
    EventTrigger({
      action: '답장 보기 진입',
      category: 'create_funnel',
      label: '답장 보기 페이지',
      value: 1,
    });
  }, []);

  useEffect(() => {
    if (!answerData?.answers?.length || !questionData?.question) {
      void navigate(-1);
    }
  }, [answerData, questionData, navigate]);

  if (!answerData?.answers?.length || !questionData?.question) {
    return null;
  }

  const enterChatRoom = (chatRoomId: string) => {
    setRoomId(chatRoomId);
    setGuestAddress(answererId!);
    if (diaryAddress) {
      setSelectedAnswerer({ answererId: answererId!, roomId: chatRoomId, diaryAddress });
    }
    void navigate('/chat/enter_room');
  };

  const fetchRoomIdFromAnswererList = async (): Promise<string | undefined> => {
    if (!diaryAddress) return undefined;
    try {
      const api = instance();
      const res = await api.get<{ answererList: IAnswerer[] }>(
        `diary/answerers/${diaryAddress}/?start=0&take=100&sortOrder=desc`,
      );
      const found = res.data.answererList.find((a) => a._id === answererId);
      return found?.roomId;
    } catch {
      return undefined;
    }
  };

  const handleOpenChat = async () => {
    if (!answererId) return;

    try {
      const token = await getChatToken();
      setChatToken(token.chatToken);

      if (roomId) {
        enterChatRoom(roomId);
        return;
      }

      const newRoomId = await openChat({ answererId, roomId });
      if (newRoomId) {
        enterChatRoom(newRoomId);
      }
    } catch (error) {
      console.error('Error opening chat:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          // 이미 채팅방 존재 → answerer 목록에서 roomId 조회 후 진입
          const existingRoomId = await fetchRoomIdFromAnswererList();
          if (existingRoomId) {
            enterChatRoom(existingRoomId);
            return;
          }
          openModal({
            title: '오류',
            description: '채팅방 정보를 가져올 수 없습니다.',
            onConfirmCallback: closeModal,
          });
          return;
        }
        if (error.response?.status === 403) {
          openModal({
            title: '안내',
            description: '다이어리 주인이 먼저 채팅방을 열어야 합니다.',
            onConfirmCallback: closeModal,
          });
          return;
        }
      }
      openModal({
        title: '오류',
        description: '채팅방 생성에 실패했습니다.',
        onConfirmCallback: closeModal,
      });
    }
  };

  const handleOpenGame = () => {
    if (!answererId || !diaryAddress) return;

    EventTrigger({
      action: '게임 버튼 클릭',
      category: 'game',
      label: '게임 버튼 클릭',
      value: 1,
    });

    void navigate(`/game/${diaryAddress}/${answererId}`);
  };

  return (
    <div className={Style.A}>
      <div className={Style.Layout}>
        <div className={Style.AnswerInfo}>
          <div className={Style.Answerer}>{answerData.answerer}님의 답장💌</div>
          <div>
            작성일: {new Date(answerData.createdAt).toLocaleDateString()}
          </div>
        </div>

        {answerData.answers.map((answer, index) => (
          <div className={Style.Answer} key={index}>
            <div className={Style.QuestionNum}>{index + 1}번 질문</div>
            <div>Q: {questionData.question[index]}</div>
            <div>A: {answer}</div>
          </div>
        ))}

        {canShowActions && (
          <div className={Style.ActionButtons}>
            <button
              className={Style.ActionButton}
              onClick={() => void handleOpenChat()}
            >
              {roomId ? '💬' : '✉️'} 채팅
            </button>
            <button className={Style.ActionButton} onClick={handleOpenGame}>
              🎮 1:1 게임하기
            </button>
          </div>
        )}

        <Button onClick={() => void navigate(-1)}>뒤로 가기</Button>
      </div>

      {isOpen && modalContent && (
        <CustomModal
          title={modalContent.title}
          description={modalContent.description}
          onConfirm={() => {
            if (modalContent.onConfirmCallback) {
              modalContent.onConfirmCallback();
            }
          }}
        />
      )}
    </div>
  );
};

export default Answer;
