import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import { answerAtom } from '@/store/answer';
import { questionAtom } from '@/store/create';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const Answer = () => {
  const answerData = useAtomValue(answerAtom);
  const questionData = useAtomValue(questionAtom);
  const navigate = useNavigate();

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

        <Button onClick={() => void navigate(-1)}>뒤로 가기</Button>
      </div>
    </div>
  );
};

export default Answer;
