import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { hasDiary } from '@/api/Create/hasDiary';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomModal from '@/components/Modal/CustomModal';
import { useModal } from '@/hooks/useModal';
import { isUpdateDiaryAtom, questionerAtom } from '@/store/create';
import { getCookie, setCookie } from '@/util/cookie-helper';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const Welcome = () => {
  const [isUpdateDiary, setIsUpdateDiary] = useAtom(isUpdateDiaryAtom);
  const [questioner, setQuestioner] = useAtom(questionerAtom);
  const nameInputRef = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();

  const { isOpen, openModal, closeModal, modalContent } = useModal();

  const diaryAddress = getCookie('diaryAddress');
  const diaryUser = getCookie('diaryUser');
  const localDiaryAddress = localStorage.getItem('diaryAddress');
  const localDiaryUser = localStorage.getItem('diaryUser');

  useEffect(() => {
    // 쿠키에 있는 값이 로컬 스토리지로, 로컬 스토리지에 있는 값이 쿠키로 이동
    if (diaryAddress || diaryUser) {
      localStorage.setItem('diaryAddress', diaryAddress ?? '');
      localStorage.setItem('diaryUser', diaryUser ?? '');
    } else if (localDiaryAddress || localDiaryUser) {
      setCookie('diaryAddress', localDiaryAddress ?? '');
      setCookie('diaryUser', localDiaryUser ?? '');
    }
  }, [diaryAddress, diaryUser, localDiaryAddress, localDiaryUser]);

  useEffect(() => {
    const checkHasDiary = async () => {
      try {
        const response = await hasDiary();

        if (response && !isUpdateDiary) {
          const redirectDiaryAddress = diaryAddress || localDiaryAddress;
          if (redirectDiaryAddress) {
            localStorage.setItem('diaryAddress', redirectDiaryAddress);
            void navigate(`/answerers/${redirectDiaryAddress}`);
          }
        }
      } catch (e) {
        console.error(e);
      }
      setIsUpdateDiary(false);
    };
    void checkHasDiary();
  }, []);

  const writeName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuestioner(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      submitName();
    }
  };

  const submitName = () => {
    if (questioner) {
      setQuestioner(questioner);
      void navigate('/questionNum');

      EventTrigger({
        action: '다이어리 만들기',
        category: 'start',
        label: '다이어리 만들기',
        value: 1,
      });
      
    } else {
      openModal({
        title: '안내사항',
        description: '이름을 입력해주세요 :)',
        onConfirmCallback: () => {
          closeModal();
          nameInputRef.current?.focus();
        },
      });
    }
  };

  return (
    <div className={Style.Layout}>
      <div className={Style.Title}>
        <div className={Style.Logo}>🐻💭</div>
        <div>
          상대에 대해 곰곰이 생각하고
          <br />
          답하는 곰곰 다이어리
        </div>
      </div>

      <div>
        <div className={Style.Intro}>반갑다곰!</div>
        <div className={Style.Description}>
          <div>질문지를 만들고 암호를 걸어</div>
          <div>소중한 친구, 가족, 연인과 공유해서</div>
          <div>많은 답장과 추억을 모아보라곰!</div>
        </div>
      </div>

      <Input
        value={questioner}
        onChange={writeName}
        onKeyUp={handleKeyPress}
        placeholder="10자 이내로 이름을 입력하세요."
        ref={nameInputRef}
        maxLength={10}
      />
      <Button color="default" onClick={submitName}>
        다이어리 만들기
      </Button>

      {isOpen && modalContent && (
        <CustomModal
          title={modalContent.title}
          description={modalContent.description}
          children={modalContent.children}
          onConfirm={() => {
            if (modalContent.onConfirmCallback) {
              modalContent.onConfirmCallback();
            }
          }}
          onCancel={modalContent.onCancelCallback}
        />
      )}
    </div>
  );
};

export default Welcome;
