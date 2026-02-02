import { GAME_CONFIG, HEARTS } from './config';
import type { HeartLevel } from '@/types/Game/types';

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private mouseX: number = GAME_CONFIG.canvasWidth / 2;
  private canDrop: boolean = true;

  private onDrop?: () => void;
  private onMove?: (x: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  setOnDrop(callback: () => void): void {
    this.onDrop = callback;
  }

  setOnMove(callback: (x: number) => void): void {
    this.onMove = callback;
  }

  private setupEventListeners(): void {
    // 마우스 이벤트
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.handleClick);

    // 터치 이벤트
    this.canvas.addEventListener('touchstart', this.handleTouchStart, {
      passive: false,
    });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    });
  }

  private getCanvasX(clientX: number): number {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    return (clientX - rect.left) * scaleX;
  }

  private handleMouseMove = (e: MouseEvent): void => {
    this.mouseX = this.getCanvasX(e.clientX);
    this.onMove?.(this.mouseX);
  };

  private handleClick = (): void => {
    this.tryDrop();
  };

  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    const touch = e.touches[0];
    this.mouseX = this.getCanvasX(touch.clientX);
    this.onMove?.(this.mouseX);
    this.tryDrop();
  };

  private handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    const touch = e.touches[0];
    this.mouseX = this.getCanvasX(touch.clientX);
    this.onMove?.(this.mouseX);
  };

  private tryDrop(): void {
    if (this.canDrop) {
      this.onDrop?.();
    }
  }

  // x 좌표를 벽 안으로 제한
  getClampedX(level: HeartLevel): number {
    const radius = HEARTS[level].radius;
    const minX = GAME_CONFIG.wallThickness + radius;
    const maxX = GAME_CONFIG.canvasWidth - GAME_CONFIG.wallThickness - radius;
    return Math.max(minX, Math.min(maxX, this.mouseX));
  }

  getMouseX(): number {
    return this.mouseX;
  }

  setCanDrop(canDrop: boolean): void {
    this.canDrop = canDrop;
  }

  dispose(): void {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('click', this.handleClick);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
  }
}
