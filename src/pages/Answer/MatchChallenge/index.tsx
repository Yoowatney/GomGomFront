import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  checkHasAlreadyAnswered,
  getQuestionerInfo,
  postCountersign,
} from '@/api/Answer/matchChallenge';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomModal from '@/components/Modal/CustomModal';
import useDiaryOwnerStatus from '@/hooks/useDiaryOwnerStatus';
import { useModal } from '@/hooks/useModal';
import { answererTokenAtom } from '@/store/answer';
import { challengeAtom, questionerAtom } from '@/store/create';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const MatchChallenge = () => {
  const { diaryAddress } = useParams();

  const navigate = useNavigate();

  const isDiaryOwner = useDiaryOwnerStatus(diaryAddress ?? '');
  const [hasAlreadyAnswered, setHasAlreadyAnswered] = useState(false);

  const [questioner, setQuestioner] = useAtom(questionerAtom);
  const [challenge, setChallenge] = useAtom(challengeAtom);

  const [countersign, setCountersign] = useState('');
  const [answererToken, setAnswererToken] = useAtom(answererTokenAtom);

  const { isOpen, modalContent, openModal, closeModal } = useModal();

  useEffect(() => {
    const verifyUserCondition = async () => {
      if (!diaryAddress) {
        return;
      }

      try {
        if (isDiaryOwner) {
          openModal({
            title: '안내사항',
            description:
              '자신의 다이어리엔 답장할 수 없어요! \n 답장 리스트로 돌아갈게요 :) ',
            onConfirmCallback: () =>
              void navigate(`/answerers/${diaryAddress}`),
          });
          return;
        }

        const hasAlreadyAnswered = await checkHasAlreadyAnswered({
          diaryAddress,
          answererToken,
        });
        setHasAlreadyAnswered(hasAlreadyAnswered);

        if (hasAlreadyAnswered) {
          openModal({
            title: '안내사항',
            description:
              '이미 답장한 다이어리엔 또 답장할 수 없어요! \n 답장 리스트로 돌아갈게요 :)',
            onConfirmCallback: () =>
              void navigate(`/answerers/${diaryAddress}`),
          });
          return;
        }

        const questionerInfo = await getQuestionerInfo(diaryAddress);

        if (questionerInfo) {
          setQuestioner(questionerInfo.questioner);
          setChallenge(questionerInfo.challenge);
        }
      } catch (e) {
        console.error('다이어리 주인 확인 중 오류 발생:', e);

        openModal({
          title: '오류',
          description: '다이어리 정보를 불러오는 데 실패했습니다.',
          onConfirmCallback: () => void navigate('/'),
        });
      }
    };
    void verifyUserCondition();
  }, [
    diaryAddress,
    openModal,
    navigate,
    isDiaryOwner,
    hasAlreadyAnswered,
    setQuestioner,
    setChallenge,
    answererToken,
  ]);

  const countersignInputRef = useRef<HTMLInputElement>(null);

  const writingCountersign = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountersign(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void submitCountersign();
    }
  };

  const handleModalConfirm = () => {
    closeModal();
    setCountersign('');
    countersignInputRef.current?.focus();
  };

  const submitCountersign = async () => {
    try {
      if (diaryAddress && countersign) {
        const response = await postCountersign({ diaryAddress, countersign });
        setAnswererToken(response.diaryToken);

        // NOTE: 기존 이벤트
        EventTrigger({
          action: '답장 시작하기',
          category: 'countersign',
          label: '답장 시작하기',
          value: 1,
        });

        void navigate(`/diary/${diaryAddress}/answerer`);
      } else if (!countersign) {
        openModal({
          title: '안내사항',
          description: '암호를 입력해주세요 :)',
          onConfirmCallback: handleModalConfirm,
        });
      }
    } catch (e) {
      console.error('다이어리 주인 확인 중 오류 발생:', e);

      openModal({
        title: '오답',
        description: '암호를 다시 입력해주세요 :)',
        onConfirmCallback: handleModalConfirm,
      });
    }
  };

  return (
    <div className={Style.Layout}>
      <div className={Style.Top}>
        <div className={Style.Emoji}>
          <img
            src="/image/gomgom/lock.png"
            alt="자물쇠"
            width={30}
            height={40}
          />
        </div>
        <div className={Style.Title}>
          <span className={Style.Questioner}>{questioner}</span>님의 다이어리를
          <br />
          보려면 암호를 맞춰야 한다곰!
        </div>
      </div>
      <div className={Style.Middle}>
        <div>{challenge}</div>
      </div>

      <div className={Style.Bottom}>
        <Input
          ref={countersignInputRef}
          value={countersign}
          placeholder="암호를 입력하세요."
          onChange={(e) => writingCountersign(e)}
          onKeyUp={handleKeyPress}
        />
        <Button color="default" onClick={() => void submitCountersign()}>
          {'다음으로 >>'}
        </Button>
      </div>

      {isOpen && modalContent && (
        <CustomModal
          title={modalContent.title}
          description={modalContent.description}
          onConfirm={() => {
            if (modalContent.onConfirmCallback) {
              modalContent.onConfirmCallback();
            }
            closeModal();
          }}
          onCancel={
            modalContent.onCancelCallback
              ? () => {
                  modalContent.onCancelCallback?.();
                  closeModal();
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default MatchChallenge;
