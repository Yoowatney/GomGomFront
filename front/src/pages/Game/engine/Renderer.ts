import type { HeartLevel, Particle } from '@/types/Game/types';

import { GAME_CONFIG, HEARTS } from './config';
import type { HeartBody } from './types';

// color.scss 변수 값들 (TypeScript에서 SCSS 변수 직접 사용 불가)
const COLORS = {
  main: '#ffd1d1',
  point: '#ff9494',
  hover: '#ff7979',
  black: '#000000',
  darkgrey: '#949494',
  background: '#fafafa',
  white: '#ffffff',
};

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private heartImages: Map<HeartLevel, HTMLImageElement> = new Map();
  private particles: Particle[] = [];
  private isWarning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.width = GAME_CONFIG.canvasWidth;
    this.canvas.height = GAME_CONFIG.canvasHeight;
    this.loadHeartImages();
  }

  // twemoji SVG 이미지 로드
  private loadHeartImages(): void {
    for (let level = 0; level <= 12; level++) {
      const heartLevel = level as HeartLevel;
      const heart = HEARTS[heartLevel];
      if (heart.image) {
        const img = new Image();
        img.src = heart.image;
        this.heartImages.set(heartLevel, img);
      }
    }
  }

  setWarning(warning: boolean): void {
    this.isWarning = warning;
  }

  clear(): void {
    // 캔버스 전체를 클리핑 영역으로 설정 (밖으로 삐져나가지 않게)
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clip();

    // 배경 그라데이션 (원본 스타일)
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      0,
      GAME_CONFIG.canvasHeight,
    );
    gradient.addColorStop(0, '#fffaf5');
    gradient.addColorStop(1, '#fff5f5');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawWalls(): void {
    const { canvasWidth, canvasHeight, wallThickness } = GAME_CONFIG;

    this.ctx.fillStyle = COLORS.main;

    // 바닥
    this.ctx.fillRect(
      0,
      canvasHeight - wallThickness,
      canvasWidth,
      wallThickness,
    );

    // 왼쪽 벽
    this.ctx.fillRect(0, 0, wallThickness, canvasHeight);

    // 오른쪽 벽
    this.ctx.fillRect(
      canvasWidth - wallThickness,
      0,
      wallThickness,
      canvasHeight,
    );
  }

  drawGameOverLine(): void {
    const { canvasWidth, gameOverLineY, wallThickness } = GAME_CONFIG;

    // 경고 시 깜빡임 효과 (color-point: #ff9494 = rgb(255, 148, 148))
    if (this.isWarning) {
      const time = Date.now() / 1000;
      const blinkSpeed = 4;
      const opacity = 0.3 + Math.sin(time * blinkSpeed * Math.PI * 2) * 0.3;
      this.ctx.fillStyle = `rgba(255, 148, 148, ${opacity})`;
    } else {
      this.ctx.fillStyle = 'rgba(255, 148, 148, 0.4)';
    }

    this.ctx.fillRect(
      wallThickness,
      gameOverLineY - 1,
      canvasWidth - wallThickness * 2,
      2,
    );
  }

  drawHeart(body: HeartBody): void {
    if (body.heartLevel === undefined) return;

    const heart = HEARTS[body.heartLevel];
    const heartImage = this.heartImages.get(body.heartLevel);

    this.ctx.save();
    this.ctx.translate(body.position.x, body.position.y);
    this.ctx.rotate(body.angle);

    // 스케일 적용 (바운스 애니메이션용)
    const scale = body.scale || 1.0;
    if (scale !== 1.0) {
      this.ctx.scale(scale, scale);
    }

    if (heartImage && heartImage.complete) {
      // 이미지를 원형 안에 맞춤
      const imageScale = 0.85;
      const size = heart.radius * 2 * imageScale;

      // 원형 클리핑
      this.ctx.beginPath();
      this.ctx.arc(0, 0, heart.radius, 0, Math.PI * 2);
      this.ctx.clip();

      // 이미지 그리기
      this.ctx.drawImage(heartImage, -size / 2, -size / 2, size, size);
    } else {
      // 폴백: 원형 그리기
      this.ctx.beginPath();
      this.ctx.arc(0, 0, heart.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = heart.color;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawHearts(hearts: HeartBody[]): void {
    for (const heart of hearts) {
      this.drawHeart(heart);
    }
  }

  // 드롭 전 미리보기 하트
  drawPreviewHeart(x: number, level: HeartLevel): void {
    const heart = HEARTS[level];
    const y = GAME_CONFIG.dropAreaY;
    const heartImage = this.heartImages.get(level);

    this.ctx.save();
    this.ctx.translate(x, y);

    if (heartImage && heartImage.complete) {
      const imageScale = 0.85;
      const size = heart.radius * 2 * imageScale;

      this.ctx.beginPath();
      this.ctx.arc(0, 0, heart.radius, 0, Math.PI * 2);
      this.ctx.clip();

      this.ctx.drawImage(heartImage, -size / 2, -size / 2, size, size);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, heart.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = heart.color;
      this.ctx.fill();
    }

    this.ctx.restore();

    // 드롭 가이드 라인 (color-main: #ffd1d1 = rgb(255, 209, 209))
    this.ctx.strokeStyle = 'rgba(255, 209, 209, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([3, 3]);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + heart.radius);
    this.ctx.lineTo(x, GAME_CONFIG.canvasHeight - GAME_CONFIG.wallThickness);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  // 파티클 버스트 효과 생성
  createParticleBurst(x: number, y: number, count: number = 20): void {
    const colors = [
      COLORS.main,
      COLORS.point,
      COLORS.hover,
      '#FFD700', // 골드
      '#FFA500', // 오렌지
    ];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4;
      const size = 3 + Math.random() * 5;
      const lifetime = 0.8 + Math.random() * 0.4;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: lifetime,
        maxLife: lifetime,
        type: Math.random() > 0.5 ? 'star' : 'heart',
      });
    }
  }

  // 파티클 업데이트
  private updateParticles(): void {
    const dt = 1 / 60;

    this.particles = this.particles.filter((p: Particle) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // 중력
      p.life -= dt;

      // 캔버스 밖으로 나가면 제거
      if (
        p.x < 0 ||
        p.x > GAME_CONFIG.canvasWidth ||
        p.y < 0 ||
        p.y > GAME_CONFIG.canvasHeight
      ) {
        return false;
      }

      return p.life > 0;
    });
  }

  // 파티클 그리기
  private drawParticles(): void {
    this.particles.forEach((p: Particle) => {
      const alpha = p.life / p.maxLife;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      if (p.type === 'star') {
        this.drawStar(p.x, p.y, p.size, p.color);
      } else {
        this.drawSmallHeart(p.x, p.y, p.size, p.color);
      }

      this.ctx.restore();
    });
  }

  // 별 파티클
  private drawStar(x: number, y: number, size: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();

    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;

      if (i === 0) {
        this.ctx.moveTo(x1, y1);
      } else {
        this.ctx.lineTo(x1, y1);
      }

      const innerAngle = angle + Math.PI / 5;
      const x2 = x + Math.cos(innerAngle) * (size / 2);
      const y2 = y + Math.sin(innerAngle) * (size / 2);
      this.ctx.lineTo(x2, y2);
    }

    this.ctx.closePath();
    this.ctx.fill();
  }

  // 작은 하트 파티클
  private drawSmallHeart(
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x - size / 4, y - size / 4, size / 2, 0, Math.PI * 2);
    this.ctx.arc(x + size / 4, y - size / 4, size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(x - size / 2, y);
    this.ctx.lineTo(x, y + size / 2);
    this.ctx.lineTo(x + size / 2, y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawScore(score: number): void {
    this.ctx.fillStyle = COLORS.darkgrey;
    this.ctx.font = "14px 'LeeSeoyun', sans-serif";
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`점수: ${score}`, 20, 25);
  }

  drawPaused(): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = COLORS.hover;
    this.ctx.font = "bold 20px 'LeeSeoyun', sans-serif";
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      '일시정지',
      this.canvas.width / 2,
      this.canvas.height / 2,
    );
  }

  drawGameOver(finalScore: number): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = COLORS.hover;
    this.ctx.font = "bold 28px 'LeeSeoyun', sans-serif";
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'Game Over!',
      this.canvas.width / 2,
      this.canvas.height / 2 - 30,
    );

    this.ctx.fillStyle = COLORS.black;
    this.ctx.font = "bold 20px 'LeeSeoyun', sans-serif";
    this.ctx.fillText(
      `최종 점수: ${finalScore}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 10,
    );
  }

  render(
    hearts: HeartBody[],
    previewX: number | null,
    currentLevel: HeartLevel,
    score: number,
    isPaused: boolean,
    isGameOver: boolean,
  ): void {
    this.clear();
    this.drawWalls();
    this.drawGameOverLine();

    // 파티클 업데이트 및 그리기
    this.updateParticles();
    this.drawParticles();

    // 하트 그리기
    this.drawHearts(hearts);

    // 미리보기 하트
    if (previewX !== null && !isPaused && !isGameOver) {
      this.drawPreviewHeart(previewX, currentLevel);
    }

    this.drawScore(score);

    if (isPaused) {
      this.drawPaused();
    }

    if (isGameOver) {
      this.drawGameOver(score);
    }

    // 클리핑 해제
    this.ctx.restore();
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}
