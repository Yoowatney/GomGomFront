import { atom } from 'jotai';

import type { GameRole, GameScoreData, HeartLevel } from '@/types/Game/types';

// 현재 점수
export const gameScoreAtom = atom<number>(0);

// 게임 오버 상태
export const isGameOverAtom = atom<boolean>(false);

// 일시정지 상태
export const isPausedAtom = atom<boolean>(false);

// 현재 하트 레벨
export const currentHeartLevelAtom = atom<HeartLevel>(1);

// 다음 하트 레벨
export const nextHeartLevelAtom = atom<HeartLevel>(1);

// 게임 역할 (owner/answerer)
export const gameRoleAtom = atom<GameRole>('answerer');

// 최고 점수 데이터
export const scoreDataAtom = atom<GameScoreData>({
  ownerBestScore: 0,
  answererBestScore: 0,
});

// 음소거 상태
export const isMutedAtom = atom<boolean>(false);
