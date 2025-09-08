import { atom } from 'jotai';

import type { IQuestionData } from '@/types/Create/types';

const questionerAtom = atom('');
const originQuestionNumAtom = atom(5);
const originQuestionArrAtom = atom([
  '내 첫인상은 어때?',
  '우리는 어떤 점이 비슷하고 달라?',
  '내가 가장 좋아하는 음식은?',
  '나를 보면 생각나는 색깔은?',
  '10년 후 우리는 어떤 모습일까?',
  '나에게 하고 싶은 말 있어?',
  '나랑 가보고 싶은 곳 있어?',
  '네가 생각하는 나의 장점은 뭐야?',
  '나와 가장 소중한 추억은?',
  '나에게 추천하고 싶은 노래는?',
]);

const customQuestionNumAtom = atom(5);
const customQuestionArrAtom = atom([
  '내 첫인상은 어때?',
  '우리는 어떤 점이 비슷하고 달라?',
  '내가 가장 좋아하는 음식은?',
  '나를 보면 생각나는 색깔은?',
  '10년 후 우리는 어떤 모습일까?',
  '나에게 하고 싶은 말 있어?',
  '나랑 가보고 싶은 곳 있어?',
  '네가 생각하는 나의 장점은 뭐야?',
  '나와 가장 소중한 추억은?',
  '나에게 추천하고 싶은 노래는?',
]);

const countersignAtom = atom('');
const challengeAtom = atom('');

const diaryAddressAtom = atom('');

const questionAtom = atom<IQuestionData | null>(null);

const isUpdateDiaryAtom = atom(false);

export {
  challengeAtom,
  countersignAtom,
  customQuestionArrAtom,
  customQuestionNumAtom,
  diaryAddressAtom,
  isUpdateDiaryAtom,
  originQuestionArrAtom,
  originQuestionNumAtom,
  questionAtom,
  questionerAtom,
};
