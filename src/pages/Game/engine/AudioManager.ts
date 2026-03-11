// 오디오 매니저 - 실제 사운드 파일 사용

export class AudioManager {
  private sounds: {
    drop: HTMLAudioElement | null;
    merge: HTMLAudioElement | null;
    tada: HTMLAudioElement | null;
  } = {
    drop: null,
    merge: null,
    tada: null,
  };
  private enabled: boolean = true;
  private initialized: boolean = false;
  private unlocked: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    try {
      // 사운드 파일 로드
      this.sounds.drop = new Audio('/assets/sounds/button.mp3');
      this.sounds.merge = new Audio('/assets/sounds/blop.mp3');
      this.sounds.tada = new Audio('/assets/sounds/tada.mp3');

      // 볼륨 설정
      if (this.sounds.drop) this.sounds.drop.volume = 0.5;
      if (this.sounds.merge) this.sounds.merge.volume = 0.6;
      if (this.sounds.tada) this.sounds.tada.volume = 0.7;

      // 프리로드
      this.sounds.drop?.load();
      this.sounds.merge?.load();
      this.sounds.tada?.load();

      this.initialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  // 브라우저 자동재생 정책을 위한 언락
  unlock(): void {
    if (this.unlocked) return;

    const unlockSound = (sound: HTMLAudioElement | null): Promise<void> => {
      if (!sound) return Promise.resolve();

      // 언락 시 볼륨 0으로 재생 (소리 안 나게)
      const originalVolume = sound.volume;
      sound.volume = 0;

      return sound
        .play()
        .then(() => {
          sound.pause();
          sound.currentTime = 0;
          sound.volume = originalVolume;
        })
        .catch(() => {
          sound.volume = originalVolume;
        });
    };

    Promise.all([
      unlockSound(this.sounds.drop),
      unlockSound(this.sounds.merge),
      unlockSound(this.sounds.tada),
    ])
      .then(() => {
        this.unlocked = true;
      })
      .catch(() => {
        // 언락 시도 완료
      });
  }

  setMuted(muted: boolean): void {
    this.enabled = !muted;
  }

  isSoundMuted(): boolean {
    return !this.enabled;
  }

  private playSound(sound: HTMLAudioElement | null, volume: number): void {
    if (!this.enabled || !this.initialized || !sound) return;

    try {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = volume;
      clone.play().catch(() => {
        // 재생 실패 무시
      });
    } catch {
      // 에러 무시
    }
  }

  // 드롭 소리 (하트가 바닥/벽/다른 하트에 착지)
  playDrop(): void {
    this.playSound(this.sounds.drop, 0.5);
  }

  // 병합 소리
  playMerge(): void {
    this.playSound(this.sounds.merge, 0.6);
  }

  // 최고 레벨 하트 생성 시 소리
  playTada(): void {
    this.playSound(this.sounds.tada, 0.7);
  }

  // 게임오버 소리 (드롭 소리 재활용)
  playGameOver(): void {
    this.playDrop();
  }

  dispose(): void {
    this.sounds.drop = null;
    this.sounds.merge = null;
    this.sounds.tada = null;
    this.initialized = false;
  }
}
