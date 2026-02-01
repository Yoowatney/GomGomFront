import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomModal from '@/components/Modal/CustomModal';
import { useGameScore } from '@/hooks/useGameScore';
import type { HeartLevel } from '@/types/Game/types';
import { getCookie } from '@/util/cookie-helper';

import { HEARTS } from './engine/config';
import HeartMergeGame from './HeartMergeGame';
import Style from './style.module.scss';

const INTRO_MODAL_KEY = 'game_intro_dont_show';

const Game = () => {
  const navigate = useNavigate();
  const { diaryId, answerId } = useParams<{
    diaryId: string;
    answerId: string;
  }>();

  // 역할 판단: 쿠키의 diaryAddress와 URL의 diaryId 비교
  const userDiaryAddress = getCookie('diaryAddress');
  const role: 'owner' | 'answerer' =
    userDiaryAddress === diaryId ? 'owner' : 'answerer';

  const isMuted = false;
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const {
    isLoading,
    isNewRecord,
    saveScore,
    getMyBestScore,
    getOpponentBestScore,
    getMyNickname,
    getOpponentNickname,
  } = useGameScore({
    diaryId: diaryId ?? '',
    answerId: answerId ?? '',
    role,
  });

  // 진입 시 인트로 모달 표시 (다시 보지 않기 체크 안 했을 경우)
  useEffect(() => {
    const dontShow = localStorage.getItem(INTRO_MODAL_KEY);
    if (dontShow !== 'true') {
      setIsIntroModalOpen(true);
    }
  }, []);

  const handleIntroConfirm = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem(INTRO_MODAL_KEY, 'true');
    }
    setIsIntroModalOpen(false);
  }, [dontShowAgain]);

  const handleGameOver = useCallback(
    async (score: number) => {
      setFinalScore(score);
      setIsGameOver(true);
      await saveScore(score);
    },
    [saveScore],
  );

  const handleRestart = useCallback(() => {
    setIsGameOver(false);
    setFinalScore(0);
    setGameKey((prev) => prev + 1);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 비교 결과 계산
  const getComparisonText = () => {
    const opponentBest = getOpponentBestScore();
    const opponentName = getOpponentNickname() || '상대방';

    if (opponentBest === 0) {
      return { text: `${opponentName}님이 아직 플레이하지 않았어요!`, className: '' };
    }

    if (finalScore > opponentBest) {
      return {
        text: `${opponentName}님의 최고 기록 ${opponentBest}점을 이겼어요!`,
        className: Style.win,
      };
    } else if (finalScore === opponentBest) {
      return {
        text: `${opponentName}님의 최고 기록과 동점이에요!`,
        className: Style.highlight,
      };
    } else {
      return {
        text: `${opponentName}님의 최고 기록까지 ${opponentBest - finalScore}점 부족해요!`,
        className: Style.lose,
      };
    }
  };

  // 잘못된 접근 체크
  if (!diaryId || !answerId) {
    return (
      <div className={Style.Layout}>
        <div className={Style.Loading}>잘못된 접근입니다.</div>
      </div>
    );
  }

  return (
    <div className={Style.Layout}>
      {/* 점수판 */}
      <div className={Style.ScoreBoardWrapper}>
        <div className={Style.ScoreBoard}>
          <div className={Style.ScoreItem}>
            <span className={Style.ScoreLabel}>
              {getMyNickname() || '나'}의 최고 점수
            </span>
            <span className={Style.ScoreValue}>
              {isLoading ? '-' : getMyBestScore()}
            </span>
          </div>
          <div className={Style.ScoreItem}>
            <span className={Style.ScoreLabel}>
              {getOpponentNickname() || '상대방'}의 최고 점수
            </span>
            <span className={`${Style.ScoreValue} ${Style.opponent}`}>
              {isLoading ? '-' : getOpponentBestScore()}
            </span>
          </div>
        </div>
        <button
          className={Style.HelpButton}
          onClick={() => setIsHelpModalOpen(true)}
        >
          ?
        </button>
      </div>

      {/* 게임 영역 */}
      <div className={Style.GameContainer}>
        <HeartMergeGame
          key={gameKey}
          isMuted={isMuted}
          onGameOver={handleGameOver}
        />
      </div>

      {/* TODO: 테스트 후 삭제 */}
      <button
        onClick={() => void handleGameOver(Math.floor(Math.random() * 500))}
        style={{
          position: 'fixed',
          bottom: 100,
          right: 10,
          padding: '8px 12px',
          background: '#ff7979',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          zIndex: 9999,
        }}
      >
        테스트 게임오버
      </button>

      {/* 인트로 모달 (게임 방법) */}
      {isIntroModalOpen && (
        <CustomModal title="게임 방법" onConfirm={handleIntroConfirm}>
          <div className={Style.IntroDescription}>
            같은 하트끼리 합쳐
            <br />
            더 큰 하트를 만들고
            <br />
            높은 점수를 획득하세요!
          </div>
          <label className={Style.DontShowAgain}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>다시 보지 않기</span>
          </label>
        </CustomModal>
      )}

      {/* 게임 오버 모달 */}
      {isGameOver && (
        <CustomModal
          title="게임 오버!"
          onConfirm={handleRestart}
          onCancel={handleGoBack}
          confirmTitle="다시 하기"
          cancelTitle="돌아가기"
          verticalButtons
        >
          <div className={Style.GameOverContent}>
            <div className={Style.FinalScore}>{finalScore}점</div>
            {isNewRecord && (
              <div className={Style.NewRecord}>새로운 최고 기록!</div>
            )}
            <div className={Style.ScoreComparison}>
              <span className={getComparisonText().className}>
                {getComparisonText().text}
              </span>
            </div>
          </div>
        </CustomModal>
      )}

      {/* 도움말 모달 */}
      {isHelpModalOpen && (
        <CustomModal
          title="하트 진화 순서"
          description="같은 하트끼리 합치면 더 큰 하트로 진화해요!"
          onConfirm={() => setIsHelpModalOpen(false)}
        >
          <div className={Style.HelpHeartGrid}>
            <div className={Style.HelpHeartRow}>
              {([0, 1, 2, 3, 4, 5, 6] as HeartLevel[]).map((level) => (
                <img
                  key={level}
                  src={HEARTS[level].image}
                  alt={HEARTS[level].emoji}
                  className={Style.HelpHeartSmall}
                />
              ))}
            </div>
            <div className={Style.HelpHeartRow}>
              {([7, 8, 9, 10] as HeartLevel[]).map((level) => (
                <img
                  key={level}
                  src={HEARTS[level].image}
                  alt={HEARTS[level].emoji}
                  className={Style.HelpHeartMedium}
                />
              ))}
            </div>
            <div className={Style.HelpHeartRow}>
              {([11, 12] as HeartLevel[]).map((level) => (
                <img
                  key={level}
                  src={HEARTS[level].image}
                  alt={HEARTS[level].emoji}
                  className={Style.HelpHeartLarge}
                />
              ))}
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default Game;
