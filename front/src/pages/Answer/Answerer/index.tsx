import { useAtom, useAtomValue } from 'jotai';
import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomModal from '@/components/Modal/CustomModal';
import { useModal } from '@/hooks/useModal';
import { answererAtom } from '@/store/answer';
import { questionerAtom } from '@/store/create';
import { checkContainsBadwords } from '@/util/string-helper';

import Style from './style.module.scss';

const Answerer = () => {
  const navigate = useNavigate();

  const { diaryAddress } = useParams();
  const [answerer, setAnswerer] = useAtom(answererAtom);
  const questioner = useAtomValue(questionerAtom);

  const answererInputRef = useRef<HTMLInputElement>(null);
  const { openModal, isOpen, modalContent, closeModal } = useModal();

  const writingAnswerer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerer(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void submitAnswerer();
    }
  };

  const handleModalConfirm = () => {
    closeModal();
    setAnswerer('');
    answererInputRef.current?.focus();
  };

  const submitAnswerer = () => {
    if (!answerer.trim()) {
      openModal({
        title: '안내사항',
        description: '이름을 입력해주세요 :)',
        onConfirmCallback: handleModalConfirm,
      });
      return;
    }

    if (checkContainsBadwords(answerer)) {
      openModal({
        title: '⚠️ 경고',
        description:
          '부적절한 단어가 포함되어 있습니다.\n 다시 입력해주세요. :)',
        onConfirmCallback: handleModalConfirm,
      });
      return;
    }
    setAnswerer(answerer);
    void navigate(`/diary/${diaryAddress}/answer`, { replace: true });
  };

  return (
    <div className={Style.Layout}>
      <div className={Style.Top}>
        <div className={Style.Emoji}>🔒</div>
        <div className={Style.Title}>
          <span className={Style.Questioner}>{questioner}</span>님에게
          <br />
          당신의 이름을 알려주세요.
        </div>
        <div>
          <div>⚠️ 부적절한 이름은 제재를 받을 수 있습니다.</div>
        </div>
      </div>
      <div className={Style.Middle}>
        <Input
          ref={answererInputRef}
          value={answerer}
          placeholder="10자 내로 입력해주세요."
          maxLength={10}
          onChange={(e) => writingAnswerer(e)}
          onKeyUp={handleKeyPress}
        />
        <div className={Style.Length}>{answerer.length}/10</div>
      </div>
      <div className={Style.Bottom}>
        <Button color="white" onClick={() => void navigate(-1)}>
          {'<< 이전으로'}
        </Button>
        <Button color="default" onClick={submitAnswerer}>
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
export default Answerer;
