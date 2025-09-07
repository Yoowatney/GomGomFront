import { atom } from 'jotai';

import type { IAnswerData } from '@/types/Create/types';

const answererAtom = atom('');
const answererTokenAtom = atom('');
const answerArrAtom = atom(['']);
const answerAtom = atom<IAnswerData | null>(null);

export { answerArrAtom, answerAtom, answererAtom, answererTokenAtom };
