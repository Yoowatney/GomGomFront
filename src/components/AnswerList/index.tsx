import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { hasDiary } from '@/api/Create/hasDiary';
import useKakaoShare from '@/hooks/useKakaoShare';
import { useModal } from '@/hooks/useModal';
import {
  challengeAtom,
  countersignAtom,
  customQuestionArrAtom,
  customQuestionNumAtom,
  isUpdateDiaryAtom,
  originQuestionArrAtom,
  originQuestionNumAtom,
  questionerAtom,
} from '@/store/create';
import type { IAnswerListSection } from '@/types/Answer/types';
import { getCookie } from '@/util/cookie-helper';
import { EventTrigger } from '@/util/ga-helper';
import { handleShareLink } from '@/util/share-helper';

import AnswererList from '../AnswererList';
import Button from '../Button';
import EmptyAnswerList from '../EmptyAnswerList';
import Fortune from '../Fortune';
import CustomModal from '../Modal/CustomModal';
import Pagination from '../Pagination';
import SortOrderSelect from '../SortOrderSelect';
import StepEmoji from '../StepEmoji';
import Style from './style.module.scss';

const AnswerListSection = (props: IAnswerListSection) => {
  const {
    answererList,
    answererCount,
    isDiaryOwner,
    sortOrder,
    handleSelectSortOrder,
    start,
    diaryId,
    correctAnswerer,
    handleDisplayResponse,
    handleOpenChat,
    currentPage,
    totalPages,
    handlePageClick,
    generatePageNumbers,
  } = props;

  const navigate = useNavigate();

  const [, setQuestioner] = useAtom(questionerAtom);
  const [, setQuestionNum] = useAtom(customQuestionNumAtom);
  const [, setQuestion] = useAtom(customQuestionArrAtom);
  const originQuestionNum = useAtomValue(originQuestionNumAtom);
  const originQustionArr = useAtomValue(originQuestionArrAtom);
  const [, setChallenge] = useAtom(challengeAtom);
  const [, setCountersign] = useAtom(countersignAtom);

  const [, setIsUpdateDiary] = useAtom(isUpdateDiaryAtom);

  const { openModal, isOpen, modalContent, closeModal } = useModal();

  const { diaryAddress } = useParams();
  const currentDiaryAddress = diaryAddress;

  const [hasUserDiary, setHasUserDiary] = useState<boolean | null>(null);

  const userDiaryAddress = getCookie('diaryAddress');
  const isViewingMyDiary = currentDiaryAddress === userDiaryAddress;

  const { shareKakaoLink } = useKakaoShare();

  const handleShareKakaoTalk = () => {
    shareKakaoLink({
      title: '곰곰 다이어리',
      description: '상대에 대해 곰곰이 생각하고 답해보세요!',
      imageUrl: `${window.location.origin}/image/thumbnail/OG_Thumb.png`,
      location: window.location.origin,
      diaryAddress: diaryAddress ?? '',
    });
  };

  const handleNewDiary = async () => {
    try {
      const response = await hasDiary();
      if (response) {
        setIsUpdateDiary(true);
        setQuestioner('');
        setQuestionNum(originQuestionNum);
        setQuestion(originQustionArr);
        setChallenge('');
        setCountersign('');

        void navigate('/');

        EventTrigger({
          action: '다이어리 새로 만들기',
          category: 'remake',
          label: '다이어리 새로 만들기',
          value: 1,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const checkHasDiary = async () => {
      try {
        const response = await hasDiary();
        if (response) {
          setHasUserDiary(!!response);
        }
      } catch (e) {
        console.error(e);
        setHasUserDiary(false);
      }
    };
    void checkHasDiary();
  }, [isViewingMyDiary]);

  if (answererCount === 0 || answererCount === undefined) {
    return <EmptyAnswerList isDiaryOwner={isDiaryOwner} />;
  }

  const getActionButtonText = (): string | undefined => {
    if (!isViewingMyDiary && hasUserDiary) {
      return '내 다이어리로 가기';
    } else if (!isViewingMyDiary && !hasUserDiary) {
      return '나도 다이어리 만들기';
    }
    return undefined;
  };

  const getActionButtonHandler = (): (() => void) | undefined => {
    if (!isViewingMyDiary && hasUserDiary) {
      return () => void navigate(`/answerers/${userDiaryAddress}`);
    } else if (!isViewingMyDiary && !hasUserDiary) {
      return () => void navigate('/');
    }
    return undefined;
  };

  const buttonText = getActionButtonText();
  const buttonHandler = getActionButtonHandler();

  const handleMakeNewDiary = () => {
    openModal({
      title: '⚠️ 주의사항',
      description:
        '이 다이어리로는 더 이상 답장을 모을 수 없어요.\n다이어리가 저장되면 답장 조회만 가능합니다. \n\n왼쪽 시계 모양을 누르면\n저장된 다이어리를 볼 수 있어요.\n\n다이어리를 새로 만들까요?',
      onCancelCallback: closeModal,
      onConfirmCallback: () => {
        void handleNewDiary();
      },
    });
  };

  const handleCopyLink = () => {
    EventTrigger({
      action: '링크 공유하기',
      category: 'share',
      label: '링크 공유하기',
      value: 1,
    });

    openModal({
      title: '✅ 완료',
      description: '링크가 복사되었습니다.',
      onConfirmCallback: () => {
        handleShareLink(`${window.location.origin}/diary/${diaryAddress}`);
        closeModal();
      },
    });
  };

  return (
    <div className={Style.Layout}>
      <Fortune />
      <div className={Style.EmojiContainer}>
        <StepEmoji answererCount={answererCount} />
        <div className={Style.Title}>{answererCount}명이 질문에 답했다곰!</div>
      </div>
      <div className={Style.List}>
        <SortOrderSelect
          sortOrder={sortOrder}
          onSortOrderChange={handleSelectSortOrder}
        />
        <AnswererList
          answererList={answererList}
          answererCount={answererCount}
          sortOrder={sortOrder}
          start={start}
          diaryId={diaryId}
          correctAnswerer={correctAnswerer}
          handleDisplayResponse={handleDisplayResponse}
          handleOpenChat={handleOpenChat}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
          generatePageNumbers={generatePageNumbers}
        />
      </div>
      {isViewingMyDiary && (
        <>
          <div className={Style.Buttons}>
            <button className={Style.Kakaotalk} onClick={handleShareKakaoTalk}>
              <img src="/image/icon/icon-KakaoTalk.svg" />
            </button>
            <button className={Style.LinkCopy} onClick={handleCopyLink}>
              <img src="/image/icon/icon-LinkCopy.svg" />
            </button>
          </div>
        </>
      )}
      {!isViewingMyDiary && buttonHandler && buttonText && (
        <Button onClick={buttonHandler}>{buttonText}</Button>
      )}
      {isViewingMyDiary && (
        <Button onClick={handleMakeNewDiary}>새로 만들기</Button>
      )}

      {isOpen && modalContent && (
        <CustomModal
          title={modalContent.title}
          description={modalContent.description}
          onConfirm={() => {
            if (modalContent.onConfirmCallback) {
              modalContent.onConfirmCallback();
            }
          }}
          {...(modalContent.onCancelCallback && {
            onCancel: () => {
              if (modalContent.onCancelCallback) {
                modalContent.onCancelCallback();
              }
            },
          })}
        />
      )}
    </div>
  );
};

export default AnswerListSection;
