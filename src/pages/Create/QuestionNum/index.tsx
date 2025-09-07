import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import useValidateCreateStep from '@/hooks/useValidateCreateStep';
import { customQuestionNumAtom } from '@/store/create';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const QuestionerNum = () => {
  const navigate = useNavigate();
  const [questionNumber, setQuestionNumber] = useAtom(customQuestionNumAtom);

  useValidateCreateStep('questionNum');

  useEffect(() => {
    EventTrigger({
      action: '질문 개수 선택 진입',
      category: 'create_funnel',
      label: '질문 개수 선택 페이지',
      value: 1,
    });
  }, []);

  const minus = () => {
    if (questionNumber > 3) {
      setQuestionNumber(questionNumber - 1);
    }
  };

  const plus = () => {
    if (questionNumber < 10) {
      setQuestionNumber(questionNumber + 1);
    }
  };

  return (
    <div className={Style.Layout}>
      <div className={Style.Title}>
        최소
        <span className={Style.highlight}> 3개</span>
        부터 최대
        <span className={Style.highlight}> 10개</span>
        까지
        <br />
        다이어리의 질문 개수를 정해달라곰!
      </div>
      <div className={Style.Circle}>
        <button className={Style.clickEffect} onClick={minus}>
          -
        </button>
        <div className={Style.Number}>{questionNumber}</div>
        <button className={Style.clickEffect} onClick={plus}>
          +
        </button>
      </div>
      <div className={Style.Buttons}>
        <Button color="white" onClick={() => void navigate('/')}>
          {'<< 이전으로'}
        </Button>
        <Button color="default" onClick={() => void navigate('/question')}>
          {'다음으로 >>'}
        </Button>
      </div>
    </div>
  );
};
export default QuestionerNum;
