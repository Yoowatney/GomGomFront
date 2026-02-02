import type { GameStateData, HeartLevel } from '@/types/Game/types';

import { AudioManager } from './AudioManager';
import { GAME_CONFIG, HEARTS, isMaxLevel } from './config';
import { GameState } from './GameState';
import { InputHandler } from './InputHandler';
import { Physics } from './Physics';
import { Renderer } from './Renderer';

const LANDING_DELAY = 200;

export class GameController {
  private physics: Physics;
  private renderer: Renderer;
  private inputHandler: InputHandler;
  private gameState: GameState;
  private audioManager: AudioManager;

  private animationFrameId: number | null = null;

  private onStateChange?: (state: GameStateData) => void;
  private onGameOver?: (score: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.physics = new Physics();
    this.renderer = new Renderer(canvas);
    this.inputHandler = new InputHandler(canvas);
    this.gameState = new GameState();
    this.audioManager = new AudioManager();

    this.setupCallbacks();
    this.createNextHeart();
  }

  private setupCallbacks(): void {
    // Physics 콜백
    this.physics.setCallbacks({
      onMerge: (level: HeartLevel, x: number, y: number) => {
        const config = HEARTS[level];
        this.gameState.addScore(config.score);
        this.audioManager.playMerge();

        // 파티클 효과
        if (isMaxLevel(level)) {
          // 최대 레벨 하트 생성 시 특별 효과
          setTimeout(() => {
            this.audioManager.playTada();
          }, 100);
          this.renderer.createParticleBurst(x, y, 30);
        } else {
          this.renderer.createParticleBurst(x, y, 10);
        }

        // 드롭 중인 하트가 병합되면 다음 하트 생성
        if (!this.physics.getDroppingHeart()) {
          this.gameState.setIsDropping(false);
          setTimeout(() => {
            this.createNextHeart();
          }, LANDING_DELAY);
        }
      },
      onLand: () => {
        this.audioManager.playDrop();
        this.gameState.setIsDropping(false);
        setTimeout(() => {
          this.createNextHeart();
        }, LANDING_DELAY);
      },
      onGameOver: () => {
        this.gameState.setGameOver();
      },
    });

    // GameState 콜백
    this.gameState.setCallbacks({
      onScoreChange: () => {
        this.onStateChange?.(this.gameState.getState());
      },
      onGameOver: () => {
        this.audioManager.playGameOver();
        this.inputHandler.setCanDrop(false);
        this.onGameOver?.(this.gameState.getScore());
      },
      onStateChange: (state: GameStateData) => {
        this.onStateChange?.(state);
      },
    });

    // Input 콜백
    this.inputHandler.setOnDrop(() => {
      if (this.gameState.getIsGameOver() || this.gameState.getIsPaused()) {
        return;
      }
      if (this.gameState.getIsDropping()) {
        return;
      }
      this.dropHeart();
    });

    this.inputHandler.setOnMove((x: number) => {
      // 현재 하트 크기에 맞게 x 좌표를 벽 안쪽으로 제한
      const level = this.gameState.getCurrentHeartLevel();
      const radius = HEARTS[level].radius;
      const minX = GAME_CONFIG.wallThickness + radius;
      const maxX = GAME_CONFIG.canvasWidth - GAME_CONFIG.wallThickness - radius;
      const clampedX = Math.max(minX, Math.min(maxX, x));

      this.gameState.setCurrentX(clampedX);
      this.physics.updateNextHeartPosition(clampedX);
    });
  }

  setCallbacks(callbacks: {
    onStateChange?: (state: GameStateData) => void;
    onGameOver?: (score: number) => void;
  }): void {
    this.onStateChange = callbacks.onStateChange;
    this.onGameOver = callbacks.onGameOver;
  }

  setMuted(muted: boolean): void {
    this.audioManager.setMuted(muted);
  }

  private createNextHeart(): void {
    if (this.gameState.getIsGameOver()) return;
    if (this.physics.getNextHeart()) return;

    const level = this.gameState.getCurrentHeartLevel();
    const x = this.gameState.getCurrentX();
    this.physics.createNextHeart(x, level);
  }

  private dropHeart(): void {
    if (!this.physics.getNextHeart()) return;

    const level = this.gameState.getCurrentHeartLevel();
    this.physics.dropHeart(level);
    this.gameState.setIsDropping(true);
    this.gameState.advanceHeart();

    // 오디오 언락 (첫 상호작용 시)
    this.audioManager.unlock();
  }

  start(): void {
    this.gameLoop();
    this.onStateChange?.(this.gameState.getState());
  }

  private gameLoop = (): void => {
    if (!this.gameState.getIsPaused() && !this.gameState.getIsGameOver()) {
      // 경고 상태 체크
      const isWarning = this.physics.checkWarningCondition();
      this.gameState.setIsWarning(isWarning);
      this.renderer.setWarning(isWarning);

      // 안전 장치: 다음 하트가 없고 드롭 중이 아니면 생성
      if (!this.gameState.getIsDropping() && !this.physics.getNextHeart()) {
        this.createNextHeart();
      }
    }

    // 렌더링
    const currentLevel = this.gameState.getCurrentHeartLevel();
    const previewX =
      !this.gameState.getIsGameOver() &&
      !this.gameState.getIsPaused() &&
      !this.gameState.getIsDropping()
        ? this.gameState.getCurrentX()
        : null;

    this.renderer.render(
      this.physics.getHearts(),
      previewX,
      currentLevel,
      this.gameState.getScore(),
      this.gameState.getIsPaused(),
      this.gameState.getIsGameOver(),
    );

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  pause(): void {
    this.gameState.setPaused(true);
  }

  resume(): void {
    this.gameState.setPaused(false);
  }

  togglePause(): void {
    if (this.gameState.getIsPaused()) {
      this.resume();
    } else {
      this.pause();
    }
  }

  restart(): void {
    this.physics.clearHearts();
    this.gameState.reset();
    this.inputHandler.setCanDrop(true);
    this.createNextHeart();
  }

  getState(): GameStateData {
    return this.gameState.getState();
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.physics.dispose();
    this.inputHandler.dispose();
    this.audioManager.dispose();
  }
}
