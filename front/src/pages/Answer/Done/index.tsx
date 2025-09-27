import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import { ConfettiEffect } from '@/components/Confetti';
import { questionerAtom } from '@/store/create';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

interface ILocationState {
  diaryAddress: string;
}

const Done = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const diaryAddress = (location.state as ILocationState)?.diaryAddress;

  const questioner = useAtomValue(questionerAtom);

  useEffect(() => {
    if (!questioner || questioner.length === 0) {
      void navigate('/');
    } else {
      ConfettiEffect();

      EventTrigger({
        action: '답장 완료하기',
        category: 'success',
        label: '답장 완료하기',
        value: 1,
      });
    }
  }, [navigate, questioner]);

  const handleGoToAnswerList = (): void => {
    void navigate(`/answerers/${diaryAddress}`);

    EventTrigger({
      action: '내 답장 확인하기',
      category: 'confirm',
      label: '답장 확인하기',
      value: 1,
    });
  };

  return (
    <div className={Style.Layout}>
      <div className={Style.Top}>
        <div className={Style.Emoji}>
          <img
            src="/image/gomgom/confetti.png"
            alt="컨페티"
            width={70}
            height={90}
          />
        </div>
        <div className={Style.Title}>답장을 보냈어요!</div>
        <div>{questioner}님에게 알려보세요 :) </div>
      </div>
      <Button
        className={Style.GoToAnswerList}
        color="default"
        onClick={handleGoToAnswerList}
      >
        내 답장 확인하기
      </Button>
    </div>
  );
};

export default Done;
