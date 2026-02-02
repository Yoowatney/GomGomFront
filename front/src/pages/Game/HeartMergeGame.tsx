import { useEffect, useRef, useState } from 'react';

import type { GameStateData } from '@/types/Game/types';

import { GameController } from './engine';
import { GAME_CONFIG } from './engine/config';
import Style from './style.module.scss';

interface HeartMergeGameProps {
  isMuted: boolean;
  onGameOver: (score: number) => void;
  onScoreChange?: (score: number) => void;
}

const HeartMergeGame = ({
  isMuted,
  onGameOver,
  onScoreChange,
}: HeartMergeGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GameController | null>(null);
  const [, setGameState] = useState<GameStateData | null>(null);

  // 게임 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new GameController(canvas);
    controllerRef.current = controller;

    controller.setCallbacks({
      onStateChange: (state: GameStateData) => {
        setGameState(state);
        onScoreChange?.(state.score);
      },
      onGameOver: (score: number) => {
        onGameOver(score);
      },
    });

    controller.setMuted(isMuted);
    controller.start();

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  // 음소거 상태 변경 시
  useEffect(() => {
    controllerRef.current?.setMuted(isMuted);
  }, [isMuted]);

  return (
    <canvas
      ref={canvasRef}
      className={Style.Canvas}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
    />
  );
};

export default HeartMergeGame;
