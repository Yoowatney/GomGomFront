import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import Input from '@/components/Input';
import useValidateCreateStep from '@/hooks/useValidateCreateStep';
import { challengeAtom } from '@/store/create';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const Challenge = () => {
  useValidateCreateStep('challenge');

  useEffect(() => {
    EventTrigger({
      action: '암호 힌트 입력 진입',
      category: 'create_funnel',
      label: '암호 힌트 입력 페이지',
      value: 1,
    });
  }, []);

  const [challenge, setChallenge] = useAtom(challengeAtom);
  const [, setIsWritten] = useState(false);
  const navigate = useNavigate();

  const challengeInputRef = useRef<HTMLInputElement>(null);

  const writingChallenge = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChallenge(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitChallenge();
    }
  };

  const submitChallenge = () => {
    if (challenge) {
      void navigate('/countersign');
    } else {
      setIsWritten(true);
      challengeInputRef.current?.focus();
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
        <div className={Style.Title}>모든 질문이 완성됐다곰!</div>
        <div>
          <div>비밀 암호를 정했다면 상대가 맞출 수 있게</div>
          <div>암호에 대한 힌트를 알려주세요!</div>
          <div>(ex. 내 생일 4자리, 내 MBTI 대문자 등)</div>
        </div>
      </div>
      <div className={Style.Middle}>
        <Input
          ref={challengeInputRef}
          value={challenge}
          placeholder="50자 내로 입력해주세요."
          maxLength={50}
          onChange={(e) => writingChallenge(e)}
          onKeyUp={handleKeyPress}
        />
        <div className={Style.Length}>{challenge.length}/50</div>
      </div>
      <div className={Style.Bottom}>
        <Button color="white" onClick={() => void navigate(-1)}>
          {'<< 이전으로'}
        </Button>
        <Button color="default" onClick={submitChallenge}>
          {'다음으로 >>'}
        </Button>
      </div>
    </div>
  );
};
export default Challenge;
