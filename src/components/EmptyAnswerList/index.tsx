import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { hasDiary } from '@/api/Create/hasDiary';
import Button from '@/components/Button';
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
import { EventTrigger } from '@/util/ga-helper';
import { handleShareLink } from '@/util/share-helper';

import CustomModal from '../Modal/CustomModal';
import Style from './style.module.scss';

interface Props {
  isDiaryOwner: boolean;
}

const EmptyAnswerList = (props: Props) => {
  const { isDiaryOwner } = props;
  const { diaryAddress } = useParams();
  const { shareKakaoLink } = useKakaoShare();
  const { openModal, isOpen, modalContent, closeModal } = useModal();
  const navigate = useNavigate();

  const [, setQuestioner] = useAtom(questionerAtom);
  const [, setQuestionNum] = useAtom(customQuestionNumAtom);
  const [, setQuestion] = useAtom(customQuestionArrAtom);
  const originQuestionNum = useAtomValue(originQuestionNumAtom);
  const originQustionArr = useAtomValue(originQuestionArrAtom);
  const [, setChallenge] = useAtom(challengeAtom);
  const [, setCountersign] = useAtom(countersignAtom);

  const [, setIsUpdateDiary] = useAtom(isUpdateDiaryAtom);
  const [hasUserDiary, setHasUserDiary] = useState<boolean | null>(null);

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
  }, []);

  const handleShareKakaoTalk = () => {
    shareKakaoLink({
      title: '곰곰 다이어리',
      description: '상대에 대해 곰곰이 생각하고 답해보세요!',
      imageUrl: `${window.location.origin}/image/thumbnail/OG_Thumb.png`,
      location: window.location.origin,
      diaryAddress: diaryAddress ?? '',
    });
  };

  const getTitle = (): string => {
    if (isDiaryOwner) {
      return '아직 아무도 내 다이어리에 답하지 않았다곰...\n 다이어리를 공유해 답장을 모아보자곰!';
    } else {
      return '아직 아무도 이 다이어리에 답하지 않았다곰... \n 네가 1등으로 답장을 써보는 거 어때?';
    }
  };

  const url = new URL(window.location.href);
  url.pathname = '';

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

  return (
    <div className={Style.Layout}>
      <div className={Style.Title}>
        <div>{getTitle()}</div>
      </div>
      <div className={Style.Desc}>텅</div>

      <div className={Style.Buttons}>
        {isDiaryOwner && (
          <div className={Style.ShareButtons}>
            <button className={Style.Kakaotalk} onClick={handleShareKakaoTalk}>
              <img src="/image/icon/icon-KakaoTalk.svg" />
            </button>
            <button className={Style.LinkCopy} onClick={handleCopyLink}>
              <img src="/image/icon/icon-LinkCopy.svg" />
            </button>
          </div>
        )}
        {isDiaryOwner ? (
          <Button color="default" onClick={handleMakeNewDiary}>
            새로 만들기
          </Button>
        ) : (
          <>
            <Button
              color="white"
              onClick={() => {
                EventTrigger({
                    action: '답장하기',
                    category: 'answer',
                    label: 'EmptyAnswerList에서 답장',
                    value: 1,
                  });
                void navigate(`/diary/${diaryAddress}`)}
              }
            >
              다이어리에 답장하기
            </Button>
            {!hasUserDiary && (
              <Button 
                color="default" 
                onClick={() => {
                  EventTrigger({
                    action: '나도 만들기',
                    category: 'make',
                    label: '나도 만들기',
                    value: 1,
                  });
                  void navigate('/');
                }}
              >
                나도 만들기
              </Button>
            )}
          </>
        )}
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
export default EmptyAnswerList;
