import { atom } from 'jotai';

import type { ISelectedAnswerer } from '@/types/Answer/types';
import type { IAnswerData } from '@/types/Create/types';

const answererAtom = atom('');
const answererTokenAtom = atom('');
const answerArrAtom = atom(['']);
const answerAtom = atom<IAnswerData | null>(null);
const selectedAnswererAtom = atom<ISelectedAnswerer | null>(null);

export {
  answerArrAtom,
  answerAtom,
  answererAtom,
  answererTokenAtom,
  selectedAnswererAtom,
};
