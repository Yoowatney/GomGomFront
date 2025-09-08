import { useAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomModal from '@/components/Modal/CustomModal';
import { useModal } from '@/hooks/useModal';
import useValidateCreateStep from '@/hooks/useValidateCreateStep';
import {
  customQuestionArrAtom,
  customQuestionNumAtom,
  originQuestionArrAtom,
} from '@/store/create';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const Question = () => {
  useValidateCreateStep('question');

  const [customQuestionNum] = useAtom(customQuestionNumAtom);
  const [, setCustomQuestionArr] = useAtom(customQuestionArrAtom);

  const [originQuestionArr] = useAtom(originQuestionArrAtom);

  const selectedQuestionArr = originQuestionArr.slice(0, customQuestionNum);

  const navigate = useNavigate();
  const { openModal, isOpen, modalContent, closeModal } = useModal();

  const { questionNum } = useParams();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(
    questionNum ? Number(questionNum) - 1 : 0,
  );

  const calculateProgress = useMemo(() => {
    if (selectedQuestionArr.length === 0) {
      return 0;
    }
    return ((currentQuestionIdx + 1) / selectedQuestionArr.length) * 100;
  }, [currentQuestionIdx, selectedQuestionArr.length]);

  const [isEdited, setIsEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');

  const [editedList, setEditedList] = useState([...selectedQuestionArr]);

  const editedQuestionInputRef = useRef<HTMLInputElement>(null);
  const currentQuestion = editedList[currentQuestionIdx];

  const [, setIsModified] = useState(false);
  const [, setIsCompleted] = useState(false);

  const showEditingModal = () => {
    openModal({
      title: '⚠️ 알림',
      description: '질문 수정을 완료해주세요.',
      onConfirmCallback: closeModal,
    });
  };

  const handleNextQuestion = () => {
    if (isEdited) {
      showEditingModal();
      return;
    }

    if (currentQuestionIdx < customQuestionNum - 1 && !isEditing) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setIsModified(false);
    } else if (isEditing) {
      setIsModified(true);
      editedQuestionInputRef.current?.focus();
    } else {
      setCustomQuestionArr(editedList);
      void navigate('/challenge');
    }
  };

  const handlePrevious = () => {
    if (isEdited) {
      showEditingModal();
      return;
    }

    if (currentQuestionIdx > 0 && !isEdited) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    } else if (!isEdited) {
      void navigate('/questionNum');
    } else {
      setIsCompleted(true);
    }
  };

  useEffect(() => {
    if (isEdited) {
      editedQuestionInputRef.current?.focus();
    }
  }, [isEdited]);

  const saveEditedQuestion = () => {
    if (!editedQuestion) {
      setIsCompleted(true);
      setIsEditing(true);
      setIsEdited(true);
      editedQuestionInputRef.current?.focus();
    } else {
      const newEditedList = [...editedList];
      newEditedList[currentQuestionIdx] = editedQuestion;
      setEditedList(newEditedList);
      setCustomQuestionArr(newEditedList);

      EventTrigger({
        action: `${currentQuestionIdx + 1}번째 질문 수정`,
        category: 'question_edit',
        label: `${currentQuestion} -> ${editedQuestion}`,
        value: 1,
      });

      setIsCompleted(false);
      setIsEditing(false);
      setIsEdited(false);
    }
  };

  const modifyQuestion = () => {
    setIsEdited(true);
    setIsEditing(true);
    setEditedQuestion('');
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
        <div className={Style.Question}>
          {!isEdited ? (
            currentQuestion
          ) : (
            <div className={Style.EditedQuestion}>
              <Input
                placeholder="100자 내로 질문을 수정하세요."
                value={editedQuestion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEditedQuestion(e.target.value);
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    saveEditedQuestion();
                  }
                }}
                ref={editedQuestionInputRef}
                maxLength={100}
              />
              <div className={Style.EditedQuestionLength}>
                {editedQuestion.length}/100
              </div>
            </div>
          )}
        </div>
        <Button
          color="grey"
          onClick={isEdited ? saveEditedQuestion : modifyQuestion}
        >
          {isEdited ? '질문 수정 완료 ' : '질문 수정하기'}
        </Button>
      </div>
      <div className={Style.Buttons}>
        <Button color="white" onClick={handlePrevious}>
          {'<< 이전으로'}
        </Button>
        <Button color="default" onClick={handleNextQuestion}>
          {'>> 다음으로'}
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
export default Question;
