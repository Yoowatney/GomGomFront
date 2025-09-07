import { AxiosError } from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getQuestionInfo, postAnswer } from '@/api/Answer/answer';
import AnswerReviewList from '@/components/AnswerPreview';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomModal from '@/components/Modal/CustomModal';
import { useModal } from '@/hooks/useModal';
import { answerArrAtom, answererAtom, answererTokenAtom } from '@/store/answer';
import { checkContainsBadwords } from '@/util/string-helper';

import Style from './style.module.scss';

const WriteAnswer = () => {
  const { diaryAddress } = useParams();
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal, modalContent } = useModal();

  const [questionArr, setQuestionArr] = useState(['']);
  const [questionNum, setQuestionNum] = useState(0);

  const answererToken = useAtomValue(answererTokenAtom);
  const answerer = useAtomValue(answererAtom);

  const [answerArr, setAnswerArr] = useAtom(answerArrAtom);

  useEffect(() => {
    const fetchQuestionInfo = async () => {
      if (!diaryAddress) {
        return;
      }

      try {
        const questionInfo = await getQuestionInfo({
          diaryAddress,
          answererToken,
        });

        setQuestionArr(questionInfo.question);
        setQuestionNum(questionInfo.questionLength);
      } catch (e) {
        void navigate(`/diary/${diaryAddress}`);
        console.error('질문 정보 불러오기 실패:', e);
      }
    };

    void fetchQuestionInfo();
  }, [answererToken, diaryAddress, navigate]);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const currentQuestion = questionArr[currentQuestionIdx];

  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (questionArr.length > 0 && currentQuestionIdx < questionArr.length) {
      setAnswer(answerArr[currentQuestionIdx] || '');
    }
  }, [currentQuestionIdx, questionArr, answerArr]);

  const calculateProgress = useMemo(() => {
    if (questionNum === 0) {
      return 0;
    }
    return ((currentQuestionIdx + 1) / questionNum) * 100;
  }, [currentQuestionIdx, questionNum]);

  const answerInputRef = useRef<HTMLInputElement>(null);

  const submitFinalAnswers = async (finalAnswers: string[]) => {
    closeModal();

    if (!diaryAddress) {
      console.error('다이어리 주소가 없습니다.');
      return;
    }

    const data = {
      diaryAddress,
      answerer,
      answers: finalAnswers,
      answererToken,
    };

    try {
      const response = await postAnswer(data);

      if (response === 201) {
        void navigate(`/done`, {
          replace: true,
          state: { diaryAddress: diaryAddress },
        });
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.status === 409) {
          openModal({
            title: '잘못된 접근',
            description: '이미 답장한 다이어리예요.',
            onConfirmCallback: () =>
              void navigate(`/answerers/${diaryAddress}`),
          });
        } else {
          openModal({
            title: '잘못된 접근',
            description: '처음부터 다시 답장을 작성해주세요.',
            onConfirmCallback: () => void navigate(`/diary/${diaryAddress}`),
          });
        }
      }
      console.error('답변 전송 실패:', e);
    }
  };

  const handleModalConfirm = () => {
    closeModal();
    answerInputRef.current?.focus();
  };

  const handleNextQuestion = () => {
    if (!answer) {
      openModal({
        title: '주의사항',
        description: '답장을 입력하거나 생략해주세요. :)',
        onConfirmCallback: handleModalConfirm,
      });
      return;
    }

    if (checkContainsBadwords(answer)) {
      openModal({
        title: '⚠️ 경고',
        description:
          '부적절한 단어가 포함되어 있습니다.\n 다시 입력해주세요. :)',
        onConfirmCallback: () => {
          setAnswer('');
          handleModalConfirm();
        },
      });
      return;
    }

    setAnswerArr((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIdx] = answer;
      return newAnswers;
    });

    if (currentQuestionIdx < questionNum - 1) {
      setCurrentQuestionIdx((prevIdx) => prevIdx + 1);
    } else {
      const finalAnswersForModal = [...answerArr];
      finalAnswersForModal[currentQuestionIdx] = answer;

      openModal({
        title: '답장을 보내시겠어요?',
        description: '답장은 취소/삭제가 불가합니다.',
        children: <AnswerReviewList answers={finalAnswersForModal} />,
        onConfirmCallback: () => void submitFinalAnswers(finalAnswersForModal),
        onCancelCallback: closeModal,
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setAnswerArr((prevAnswers) => {
        const newAnswers = [...prevAnswers];
        newAnswers[currentQuestionIdx] = answer;
        return newAnswers;
      });
      setCurrentQuestionIdx((prevIdx) => prevIdx - 1);
    } else {
      void navigate(-1);
    }
  };

  const handleSkip = () => {
    const skipText = '생략했어요.';

    setAnswerArr((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIdx] = skipText;
      return newAnswers;
    });

    if (currentQuestionIdx < questionNum - 1) {
      setCurrentQuestionIdx((prevIdx) => prevIdx + 1);
      setAnswer('');
    } else {
      const finalAnswersForModal = [...answerArr];
      finalAnswersForModal[currentQuestionIdx] = skipText;

      openModal({
        title: '답장을 보내시겠어요?',
        description: '답장은 취소/삭제가 불가합니다.',
        children: <AnswerReviewList answers={finalAnswersForModal} />,
        onConfirmCallback: () => void submitFinalAnswers(finalAnswersForModal),
        onCancelCallback: closeModal,
      });
    }
  };

  return (
    <div className={Style.Layout}>
      <div className={Style.ProgressBar}>
        <div
          className={Style.Progress}
          style={{ width: `${calculateProgress}%` }}
        />
      </div>
      <div className={Style.QuestionWrapper}>
        <div className={Style.QuestionNum}>
          ✉️ {currentQuestionIdx + 1}번째 질문 ✉️
        </div>
        <div className={Style.Question}>{currentQuestion}</div>
        <div className={Style.Answer}>
          <Input
            placeholder="100자 내로 답장을 입력하세요."
            value={answer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAnswer(e.target.value);
            }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                void handleNextQuestion();
              }
            }}
            ref={answerInputRef}
            maxLength={100}
          />
          <div className={Style.AnswerLength}>{answer.length}/100</div>
        </div>
      </div>
      <div className={Style.Buttons}>
        <Button color="white" onClick={handlePrevious}>
          {'<< 이전으로'}
        </Button>
        <Button color="default" onClick={handleNextQuestion}>
          {'>> 다음으로'}
        </Button>
        <Button color="grey" onClick={handleSkip}>
          넘어가기
        </Button>
      </div>

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

export default WriteAnswer;
