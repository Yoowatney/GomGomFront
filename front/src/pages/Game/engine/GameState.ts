import type { GameStateData, HeartLevel } from '@/types/Game/types';

import { GAME_CONFIG, getRandomSpawnLevel } from './config';

export class GameState {
  private score: number = 0;
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private isWarning: boolean = false;
  private currentHeartLevel: HeartLevel;
  private nextHeartLevel: HeartLevel;
  private currentX: number = GAME_CONFIG.canvasWidth / 2;
  private isDropping: boolean = false;

  private onScoreChange?: (score: number) => void;
  private onGameOver?: () => void;
  private onStateChange?: (state: GameStateData) => void;

  constructor() {
    this.currentHeartLevel = getRandomSpawnLevel();
    this.nextHeartLevel = getRandomSpawnLevel();
  }

  setCallbacks(callbacks: {
    onScoreChange?: (score: number) => void;
    onGameOver?: () => void;
    onStateChange?: (state: GameStateData) => void;
  }): void {
    this.onScoreChange = callbacks.onScoreChange;
    this.onGameOver = callbacks.onGameOver;
    this.onStateChange = callbacks.onStateChange;
  }

  getScore(): number {
    return this.score;
  }

  addScore(points: number): void {
    this.score += points;
    this.onScoreChange?.(this.score);
    this.notifyStateChange();
  }

  getIsGameOver(): boolean {
    return this.isGameOver;
  }

  setGameOver(): void {
    if (!this.isGameOver) {
      this.isGameOver = true;
      this.onGameOver?.();
      this.notifyStateChange();
    }
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  setPaused(paused: boolean): void {
    this.isPaused = paused;
    this.notifyStateChange();
  }

  getIsWarning(): boolean {
    return this.isWarning;
  }

  setIsWarning(warning: boolean): void {
    this.isWarning = warning;
  }

  getCurrentHeartLevel(): HeartLevel {
    return this.currentHeartLevel;
  }

  getNextHeartLevel(): HeartLevel {
    return this.nextHeartLevel;
  }

  setNextHeartId(id: HeartLevel): void {
    this.nextHeartLevel = id;
  }

  getCurrentX(): number {
    return this.currentX;
  }

  setCurrentX(x: number): void {
    this.currentX = x;
  }

  getIsDropping(): boolean {
    return this.isDropping;
  }

  setIsDropping(dropping: boolean): void {
    this.isDropping = dropping;
  }

  // 드롭 후 다음 하트로 전환
  advanceHeart(): void {
    this.currentHeartLevel = this.nextHeartLevel;
    this.nextHeartLevel = getRandomSpawnLevel();
    this.notifyStateChange();
  }

  getState(): GameStateData {
    return {
      score: this.score,
      isGameOver: this.isGameOver,
      isPaused: this.isPaused,
      currentHeartLevel: this.currentHeartLevel,
      nextHeartLevel: this.nextHeartLevel,
      isWarning: this.isWarning,
    };
  }

  private notifyStateChange(): void {
    this.onStateChange?.(this.getState());
  }

  reset(): void {
    this.score = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.isWarning = false;
    this.currentHeartLevel = getRandomSpawnLevel();
    this.nextHeartLevel = getRandomSpawnLevel();
    this.currentX = GAME_CONFIG.canvasWidth / 2;
    this.isDropping = false;
    this.onScoreChange?.(0);
    this.notifyStateChange();
  }
}
