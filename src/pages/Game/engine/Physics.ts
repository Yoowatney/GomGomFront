import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Runner,
  World,
} from 'matter-js';

import type { HeartLevel } from '@/types/Game/types';

import { GAME_CONFIG, getNextLevel, HEARTS, isMaxLevel } from './config';
import type { HeartBody } from './types';

export class Physics {
  private engine: Engine;
  private world: World;
  private runner: Runner;
  private hearts: HeartBody[] = [];
  private nextHeart: HeartBody | null = null;
  private droppingHeart: HeartBody | null = null;

  private onMerge?: (level: HeartLevel, x: number, y: number) => void;
  private onLand?: () => void;
  private onGameOver?: () => void;

  constructor() {
    this.engine = Engine.create();
    this.engine.gravity.y = GAME_CONFIG.gravity;

    // 충돌 감지 정확도 향상
    this.engine.positionIterations = 10;
    this.engine.velocityIterations = 8;
    this.engine.constraintIterations = 4;

    this.world = this.engine.world;
    this.createWalls();
    this.setupCollisionHandler();

    // Runner로 물리 엔진 실행
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  setCallbacks(callbacks: {
    onMerge?: (level: HeartLevel, x: number, y: number) => void;
    onLand?: () => void;
    onGameOver?: () => void;
  }): void {
    this.onMerge = callbacks.onMerge;
    this.onLand = callbacks.onLand;
    this.onGameOver = callbacks.onGameOver;
  }

  private createWalls(): void {
    const { canvasWidth, canvasHeight, wallThickness } = GAME_CONFIG;

    // 바닥 (두껍게) - 시각적 벽 상단에 맞춤
    const groundThickness = 100;
    const ground = Bodies.rectangle(
      canvasWidth / 2,
      canvasHeight - wallThickness + groundThickness / 2,
      canvasWidth,
      groundThickness,
      {
        isStatic: true,
        label: 'ground',
        friction: 0.8,
        restitution: 0.2,
      },
    );

    // 왼쪽 벽 (캔버스 안쪽에 위치)
    const leftWall = Bodies.rectangle(
      wallThickness / 2,
      canvasHeight / 2,
      wallThickness,
      canvasHeight * 2,
      {
        isStatic: true,
        label: 'leftWall',
        friction: 0.8,
        restitution: 0.2,
      },
    );

    // 오른쪽 벽 (캔버스 안쪽에 위치)
    const rightWall = Bodies.rectangle(
      canvasWidth - wallThickness / 2,
      canvasHeight / 2,
      wallThickness,
      canvasHeight * 2,
      {
        isStatic: true,
        label: 'rightWall',
        friction: 0.8,
        restitution: 0.2,
      },
    );

    // 게임오버 라인 (센서)
    const gameOverLine = Bodies.rectangle(
      canvasWidth / 2,
      GAME_CONFIG.gameOverLineY,
      canvasWidth,
      2,
      {
        isStatic: true,
        isSensor: true,
        label: 'gameOverLine',
      },
    );

    Composite.add(this.world, [ground, leftWall, rightWall, gameOverLine]);
  }

  private setupCollisionHandler(): void {
    Events.on(this.engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        this.handleCollision(pair.bodyA as HeartBody, pair.bodyB as HeartBody);
      }
    });
  }

  private handleCollision(bodyA: HeartBody, bodyB: HeartBody): void {
    // 게임오버 라인 체크
    if (bodyA.label === 'gameOverLine' || bodyB.label === 'gameOverLine') {
      const heart = bodyA.label === 'gameOverLine' ? bodyB : bodyA;
      if (
        heart.label.startsWith('heart-') &&
        !heart.isSensor &&
        !heart.isNext
      ) {
        setTimeout(() => {
          if (heart.position.y < GAME_CONFIG.gameOverLineY + 50) {
            this.onGameOver?.();
          }
        }, 1000);
      }
      return;
    }

    // 하트 병합 체크
    if (
      bodyA.label.startsWith('heart-') &&
      bodyB.label.startsWith('heart-') &&
      !bodyA.isNext &&
      !bodyB.isNext &&
      !bodyA.isStatic &&
      !bodyB.isStatic &&
      bodyA.heartLevel !== undefined &&
      bodyB.heartLevel !== undefined
    ) {
      if (
        bodyA.heartLevel === bodyB.heartLevel &&
        !isMaxLevel(bodyA.heartLevel) &&
        !bodyA.isMerging &&
        !bodyB.isMerging
      ) {
        bodyA.isMerging = true;
        bodyB.isMerging = true;

        const newLevel = getNextLevel(bodyA.heartLevel);
        const x = (bodyA.position.x + bodyB.position.x) / 2;
        const y = (bodyA.position.y + bodyB.position.y) / 2;

        // 기존 하트 제거
        this.removeHeart(bodyA);
        this.removeHeart(bodyB);

        // 드롭 중인 하트가 병합되면 먼저 처리 (콜백 호출 전에!)
        const wasDropping = this.droppingHeart === bodyA || this.droppingHeart === bodyB;
        if (wasDropping) {
          this.droppingHeart = null;
        }

        // 새 하트 생성
        const newBody = this.createHeart(x, y, newLevel);
        this.addBounceAnimation(newBody);

        // 콜백 호출 (droppingHeart가 이미 null이므로 새 하트 생성됨)
        this.onMerge?.(newLevel, x, y);

        return;
      }
    }

    // 드롭 중인 하트 착지 체크
    if (this.droppingHeart) {
      if (bodyA === this.droppingHeart || bodyB === this.droppingHeart) {
        const other =
          bodyA === this.droppingHeart ? bodyB : bodyA;
        if (
          other.label === 'ground' ||
          other.label === 'leftWall' ||
          other.label === 'rightWall' ||
          (other.label.startsWith('heart-') && !other.isNext)
        ) {
          this.droppingHeart = null;
          this.onLand?.();
        }
      }
    }
  }

  createHeart(x: number, y: number, level: HeartLevel, isNext: boolean = false): HeartBody {
    const heart = HEARTS[level];
    const body = Bodies.circle(x, y, heart.radius, {
      restitution: 0.3,
      friction: 0.1,
      density: 0.001,
      label: `heart-${level}`,
      isStatic: isNext,
      isSensor: isNext,
    }) as HeartBody;

    body.heartLevel = level;
    body.isMerging = false;
    body.createdAt = Date.now();
    body.scale = 1.0;
    body.isNext = isNext;

    Composite.add(this.world, body);

    if (!isNext) {
      this.hearts.push(body);
    }

    return body;
  }

  createNextHeart(x: number, level: HeartLevel): HeartBody {
    if (this.nextHeart) {
      Composite.remove(this.world, this.nextHeart);
    }
    this.nextHeart = this.createHeart(x, GAME_CONFIG.dropAreaY, level, true);
    return this.nextHeart;
  }

  updateNextHeartPosition(x: number): void {
    if (this.nextHeart) {
      Body.setPosition(this.nextHeart, { x, y: GAME_CONFIG.dropAreaY });
    }
  }

  dropHeart(level: HeartLevel): HeartBody | null {
    if (!this.nextHeart) return null;

    const dropX = this.nextHeart.position.x;
    const dropY = this.nextHeart.position.y;

    // 정적 하트 제거
    Composite.remove(this.world, this.nextHeart);
    this.nextHeart = null;

    // 동적 하트 생성
    const newBody = this.createHeart(dropX, dropY, level, false);
    this.droppingHeart = newBody;

    return newBody;
  }

  private removeHeart(body: HeartBody): void {
    const index = this.hearts.indexOf(body);
    if (index > -1) {
      this.hearts.splice(index, 1);
      Composite.remove(this.world, body);
    }
  }

  // 바운스 애니메이션 추가
  private addBounceAnimation(body: HeartBody): void {
    const duration = 400;
    const startTime = Date.now();
    const startScale = 0.5;
    const maxScale = 1.2;
    const endScale = 1.0;

    const animate = (): void => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 0.6) {
        const phase1Progress = progress / 0.6;
        body.scale = startScale + (maxScale - startScale) * phase1Progress;
      } else {
        const phase2Progress = (progress - 0.6) / 0.4;
        body.scale = maxScale + (endScale - maxScale) * phase2Progress;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        body.scale = endScale;
      }
    };

    body.scale = startScale;
    animate();
  }

  // 경고 상태 체크 (하트가 게임오버 라인 근처에 있는지)
  checkWarningCondition(): boolean {
    const warningThreshold = GAME_CONFIG.gameOverLineY + 10;

    for (const heart of this.hearts) {
      if (heart === this.droppingHeart) continue;
      if (heart.heartLevel === undefined) continue;

      const config = HEARTS[heart.heartLevel];
      const topEdge = heart.position.y - config.radius;

      if (topEdge <= warningThreshold) {
        return true;
      }
    }

    return false;
  }

  getHearts(): HeartBody[] {
    return this.hearts;
  }

  getNextHeart(): HeartBody | null {
    return this.nextHeart;
  }

  getDroppingHeart(): HeartBody | null {
    return this.droppingHeart;
  }

  clearHearts(): void {
    for (const heart of [...this.hearts]) {
      Composite.remove(this.world, heart);
    }
    this.hearts = [];

    if (this.nextHeart) {
      Composite.remove(this.world, this.nextHeart);
      this.nextHeart = null;
    }

    this.droppingHeart = null;
  }

  dispose(): void {
    Runner.stop(this.runner);
    Events.off(this.engine, 'collisionStart');
    World.clear(this.world, false);
    Engine.clear(this.engine);
  }
}
