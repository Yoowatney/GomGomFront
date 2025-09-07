import canvasConfetti from 'canvas-confetti';

export const ConfettiEffect = () => {
  void canvasConfetti({
    particleCount: 150,
    spread: 50,
    origin: { x: 0.5, y: 0.7 },
  });
};
