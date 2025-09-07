import { useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  challengeAtom,
  countersignAtom,
  customQuestionArrAtom,
  customQuestionNumAtom,
  questionerAtom,
} from '@/store/create';

type CreateStep =
  | 'questionNum'
  | 'question'
  | 'challenge'
  | 'countersign'
  | 'finish';

const useValidateCreateStep = (step: CreateStep) => {
  const navigate = useNavigate();

  const questioner = useAtomValue(questionerAtom);
  const customQuestionNum = useAtomValue(customQuestionNumAtom);
  const customQuestionArr = useAtomValue(customQuestionArrAtom);
  const challenge = useAtomValue(challengeAtom);
  const countersign = useAtomValue(countersignAtom);

  const getStepValidation = useCallback(
    (currentStep: CreateStep): boolean => {
      switch (currentStep) {
        case 'questionNum':
          return questioner.trim() !== '';
        case 'question':
          return questioner.trim() !== '' && customQuestionNum > 0;
        case 'challenge':
          return (
            questioner.trim() !== '' &&
            customQuestionNum > 0 &&
            customQuestionArr.length === customQuestionNum &&
            customQuestionArr.every((q) => q.trim() !== '')
          );
        case 'countersign':
          return (
            questioner.trim() !== '' &&
            customQuestionNum > 0 &&
            customQuestionArr.length === customQuestionNum &&
            customQuestionArr.every((q) => q.trim() !== '') &&
            challenge.trim() !== ''
          );
        case 'finish':
          return (
            questioner.trim() !== '' &&
            customQuestionNum > 0 &&
            customQuestionArr.length === customQuestionNum &&
            customQuestionArr.every((q) => q.trim() !== '') &&
            challenge.trim() !== '' &&
            countersign.trim() !== ''
          );
        default:
          return false;
      }
    },
    [questioner, customQuestionNum, customQuestionArr, challenge, countersign],
  );

  useEffect(() => {
    const isValid = getStepValidation(step);

    if (!isValid) {
      console.warn(`Step validation failed for ${step}. Redirecting to home.`);
      void navigate('/', { replace: true });
    }
  }, [step, navigate, getStepValidation]);

  return {
    isValid: getStepValidation(step),
    questioner,
    customQuestionNum,
    customQuestionArr,
    challenge,
    countersign,
  };
};

export default useValidateCreateStep;
