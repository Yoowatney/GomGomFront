import { useEffect, useState } from 'react';

import CustomModal from '../Modal/CustomModal';
import { getDailyFortune, hideFortuneForToday } from './fortuneData';
import Style from './style.module.scss';

const Fortune = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fortune, setFortune] = useState<{
    luckPercent: number;
    mainMessage: string;
    subMessage: string;
    luckyItem: string;
  } | null>(null);

  useEffect(() => {
    const { fortune: dailyFortune, shouldShow } = getDailyFortune();
    if (shouldShow && dailyFortune) {
      setFortune(dailyFortune);
    }
  }, []);

  if (!fortune) {
    return null;
  }

  const handleFortuneClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleHideForToday = () => {
    setIsModalOpen(false);
    hideFortuneForToday();
  };

  return (
    <>
      <div className={Style.FortuneIcon} onClick={handleFortuneClick}>
        🍀
      </div>
      {isModalOpen && (
        <CustomModal
          title="🍀 오늘의 운세"
          onConfirm={handleCloseModal}
          onCancel={handleHideForToday}
          confirmTitle="확인"
          cancelTitle="그만보기"
        >
          <div className={Style.FortuneContent}>
            <div className={Style.LuckContainer}>
              <span className={Style.LuckLabel}>행운지수</span>
              <div className={Style.LuckBar}>
                <div
                  className={Style.LuckFill}
                  style={{ width: `${fortune.luckPercent}%` }}
                />
              </div>
              <span className={Style.LuckPercent}>{fortune.luckPercent}%</span>
            </div>
            <div className={Style.FortuneText}>
              <p className={Style.MainMessage}>{fortune.mainMessage}</p>
              <p className={Style.SubMessage}>{fortune.subMessage}</p>
            </div>
            <div className={Style.LuckyItem}>
              <span className={Style.ItemLabel}>행운의 아이템/장소:</span>
              <span className={Style.ItemValue}>{fortune.luckyItem}</span>
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default Fortune;
