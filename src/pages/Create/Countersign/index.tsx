import { AxiosError } from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createDiary } from '@/api/Create/challenge';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomModal from '@/components/Modal/CustomModal';
import { useModal } from '@/hooks/useModal';
import useValidateCreateStep from '@/hooks/useValidateCreateStep';
import {
  challengeAtom,
  countersignAtom,
  customQuestionArrAtom,
  questionerAtom,
} from '@/store/create';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const Countersign = () => {
  useValidateCreateStep('countersign');

  useEffect(() => {
    EventTrigger({
      action: '비밀번호 입력 진입',
      category: 'create_funnel',
      label: '비밀번호 입력 페이지',
      value: 1,
    });
  }, []);

  const [countersign, setCountersign] = useAtom(countersignAtom);

  const question = useAtomValue(customQuestionArrAtom);
  const questioner = useAtomValue(questionerAtom);
  const challenge = useAtomValue(challengeAtom);

  const [, setIsWritten] = useState(false);

  const { isOpen, modalContent, openModal } = useModal();

  const navigate = useNavigate();

  const countersignInputRef = useRef<HTMLInputElement>(null);

  const writingCountersign = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountersign(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void submitCountersign();
    }
  };

  const submitCountersign = async () => {
    if (countersign) {
      try {
        const data = {
          questioner,
          question,
          challenge,
          countersign,
        };

        setCountersign(countersign);

        const response = await createDiary(data);

        if (response === 201 || response === 204) {
          void navigate('/finish');
          return;
        } else {
          void navigate('/');
        }
      } catch (e) {
        console.error(e);

        if (e instanceof AxiosError) {
          if (e.status === 400) {
            openModal({
              title: '오류',
              description:
                '다이어리를 완성할 정보가 부족해요.\n 다시 만들어주세요 :)',
              onConfirmCallback: () => void navigate('/'),
            });
          } else if (e.status === 401) {
            openModal({
              title: '오류',
              description: '암호와 힌트가 달라요. 다시 입력해주세요.',
              onConfirmCallback: () => void navigate(-1),
            });
          } else {
            openModal({
              title: '오류',
              description: '',
              onConfirmCallback: () => void navigate('/'),
            });
          }
        }
      }
    } else {
      setIsWritten(true);
      countersignInputRef.current?.focus();
    }
  };

  return (
    <div className={Style.Layout}>
      <div className={Style.Top}>
        <div className={Style.Emoji}>
          <img src="/image/gomgom/key.png" alt="열쇠" width={50} height={40} />
        </div>
        <div className={Style.Title}>거의 다 왔다곰!</div>
        <div>
          <div>비밀 암호를 아는 사람만 답장할 수 있도록</div>
          <div>비밀 암호의 답을 정확하게 입력해주세요.</div>
          <div>(ex. 0718, INFJ 등)</div>
        </div>
      </div>
      <div className={Style.Middle}>
        <Input
          ref={countersignInputRef}
          value={countersign}
          placeholder="50자 내로 입력해주세요."
          maxLength={50}
          onChange={(e) => writingCountersign(e)}
          onKeyUp={handleKeyPress}
        />
        <div className={Style.Length}>{countersign.length}/50</div>
      </div>
      <div className={Style.Bottom}>
        <Button color="white" onClick={() => void navigate(-1)}>
          {'<< 이전으로'}
        </Button>
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
          }}
        />
      )}
    </div>
  );
};
export default Countersign;
