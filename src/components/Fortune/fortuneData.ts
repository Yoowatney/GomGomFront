interface IFortuneData {
  luckPercent: number;
  mainMessage: string;
  subMessage: string;
  luckyItem: string;
}

interface IStoredIFortuneData extends IFortuneData {
  date: string;
  shouldShow: boolean;
}

const fortuneMessages = [
  {
    mainMessage: '오늘은 짝남/짝녀랑 눈이 마주칠 수도 있어요!',
    subMessage: '살짝 웃어보면 하루가 두근거릴 거예요.',
  },
  {
    mainMessage: '오늘은 급식이 맛있는 날이에요!',
    subMessage: '친구랑 얘기하면서 더 즐겁게 먹어보세요.',
  },
  {
    mainMessage: '오늘은 숙제나 공부가 빨리 끝나는 날이에요!',
    subMessage: '얼른 끝내고 유튜브나 게임을 마음껏 즐겨보세요.',
  },
  {
    mainMessage: '오늘은 짝꿍이랑 친해질 기회가 생겨요!',
    subMessage: '작은 부탁이나 농담으로 분위기를 풀어보세요.',
  },
  {
    mainMessage: '오늘은 공부 운이 좋은 날이에요!',
    subMessage: '공부하면 내용이 머리로 쏙쏙 들어올 거예요.',
  },
  {
    mainMessage: '오늘은 기분 업되는 날이에요!',
    subMessage: '좋아하는 노래를 크게 틀고 따라 불러보세요.',
  },
  {
    mainMessage: '오늘은 체육 시간이 빛나는 날이에요!',
    subMessage: '평소보다 더 잘할 수 있어요.',
  },
  {
    mainMessage: '오늘은 작은 행복이 가득한 날이에요!',
    subMessage: '맛있는 간식이 더 맛있게 느껴질 거예요.',
  },
  {
    mainMessage: '오늘은 용기가 솟는 날이에요!',
    subMessage: '짝녀/짝남한테 먼저 카톡 보내도 괜찮아요.',
  },
  {
    mainMessage: '오늘은 웃음이 끊이지 않는 날이에요!',
    subMessage: '친구들이랑 얘기를 나누다 보면 하루가 금방 갈거예요.',
  },
  {
    mainMessage: '오늘은 직감이 좋은 날이에요!',
    subMessage: '찍은 문제나 첫 느낌이 정답일 확률이 높아요.',
  },
  {
    mainMessage: '오늘은 새로운 일이 생기는 날이에요!',
    subMessage: '재밌는 이벤트나 놀 일이 생길 수 있어요.',
  },
  {
    mainMessage: '오늘은 수다 파티하기 좋은 날이에요!',
    subMessage: '친구랑 얘기하다 보면 시간이 순삭될 거예요.',
  },
  {
    mainMessage: '오늘은 외모가 빛나는 날이에요!',
    subMessage: '셀카 찍으면 인생샷을 건질 수 있을 거예요.',
  },
  {
    mainMessage: '오늘은 자신감 뿜뿜하는 날이에요!',
    subMessage: '발표할 때 목소리도 또렷하고 반응도 좋을 거예요.',
  },
  {
    mainMessage: '오늘은 신기한 걸 발견하는 날이에요!',
    subMessage: '학교 가는 길에 평소 못 보던 걸 발견할 수 있어요.',
  },
  {
    mainMessage: '오늘은 고마운 마음이 드는 날이에요!',
    subMessage: '엄마 아빠나 친구한테 "고마워" 한마디 해보세요.',
  },
  {
    mainMessage: '오늘은 도전 욕구가 샘솟는 날이에요!',
    subMessage: '미뤄둔 숙제나 새로운 게임 모드에 도전해보세요.',
  },
  {
    mainMessage: '오늘은 기분 전환하기 딱 좋은 날이에요!',
    subMessage: '동네 산책이나 러닝을 하면 스트레스가 확 풀려요.',
  },
  {
    mainMessage: '오늘은 친구랑 협력하면 잘 되는 날이에요!',
    subMessage: '조별 과제나 게임에서 팀워크가 빛을 발할 거예요.',
  },
  {
    mainMessage: '오늘은 선택을 잘하는 날이에요!',
    subMessage: '급식 메뉴나 간식 고를 때 후회 없는 선택을 할 거예요.',
  },
  {
    mainMessage: '오늘은 예술 감각이 뿜뿜하는 날이에요!',
    subMessage: '그림 그리기나 프로필 꾸미기를 해보면 잘 나올 거예요.',
  },
  {
    mainMessage: '오늘은 정리정돈 운이 좋은 날이에요!',
    subMessage: '책상이나 가방을 정리하면 보물 같은 걸 찾을 수 있어요.',
  },
  {
    mainMessage: '오늘은 친구랑 더 친해지는 날이에요!',
    subMessage: '비밀 얘기를 나누면서 사이가 더 가까워질 수 있어요.',
  },
  {
    mainMessage: '오늘은 계획 세우기 좋은 날이에요!',
    subMessage: '다음 주말에 뭘 할지 정해두면 기대가 두 배가 돼요.',
  },
];

const luckyItems = [
  '🍗 치킨',
  '🖊️ 친구가 빌려준 펜',
  '📱 인스타 스토리',
  '🎧 좋아하는 가수 노래',
  '🍜 편의점 라면',
  '🧢 모자',
  '🎒 가방',
  '🍪 쿠키',
  '📓 공책',
  '📷 셀카',
  '🍫 초콜릿',
  '🎮 PC방',
  '🛏️ 내 방',
  '⚽️ 축구공',
  '💄 틴트/립밤',
  '🏠 집',
  '🎮 게임',
  '🎵 자주 듣는 노래',
  '🍕 피자',
  '🥟 만두',
  '📱 귀여운 폰케이스',
  '🍊 과일',
  '👟 운동화',
  '💌 편지',
  '🍭 막대사탕',
  '🎀 머리끈',
  '💎 악세사리',
  '🧃 주스/음료수',
  '🎤 노래방',
  '📖 만화카페',
  '🎲 보드게임방',
  '🦄 인형',
  '🍟 감자튀김',
  '🥤 탄산음료',
  '🧩 퍼즐',
  '🎂 케이크',
  '🍩 도넛',
  '📱 그립톡',
  '🎈 놀이공원',
  '🎨 그림',
  '📺 거실',
  '🍙 삼각김밥',
  '🐻 뽑기방',
  '🌭 핫도그',
  '🎬 영화관',
  '🧸 키링',
  '📸 인생네컷',
  '🍓 딸기우유',
  '📱 틱톡/릴스 영상',
  '🏀 농구공',
  '🚲 자전거',
  '🍦 아이스크림',
];

const FORTUNE_STORAGE_KEY = 'daily_fortune';

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const isIStoredIFortuneData = (data: unknown): data is IStoredIFortuneData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'luckPercent' in data &&
    'mainMessage' in data &&
    'subMessage' in data &&
    'luckyItem' in data &&
    'date' in data &&
    'shouldShow' in data &&
    typeof (data as IStoredIFortuneData).luckPercent === 'number' &&
    typeof (data as IStoredIFortuneData).mainMessage === 'string' &&
    typeof (data as IStoredIFortuneData).subMessage === 'string' &&
    typeof (data as IStoredIFortuneData).luckyItem === 'string' &&
    typeof (data as IStoredIFortuneData).date === 'string' &&
    typeof (data as IStoredIFortuneData).shouldShow === 'boolean'
  );
};

const createNewFortune = (): IFortuneData => {
  const luckPercent = Math.floor(Math.random() * 101);
  const randomMessage =
    fortuneMessages[Math.floor(Math.random() * fortuneMessages.length)];
  const randomLuckyItem =
    luckyItems[Math.floor(Math.random() * luckyItems.length)];

  return {
    luckPercent,
    mainMessage: randomMessage.mainMessage,
    subMessage: randomMessage.subMessage,
    luckyItem: randomLuckyItem,
  };
};

export const getDailyFortune = (): {
  fortune: IFortuneData | null;
  shouldShow: boolean;
} => {
  try {
    const stored = localStorage.getItem(FORTUNE_STORAGE_KEY);
    const today = getTodayDateString();

    if (stored) {
      const parsedData = JSON.parse(stored) as unknown;
      if (isIStoredIFortuneData(parsedData) && parsedData.date === today) {
        return {
          fortune: {
            luckPercent: parsedData.luckPercent,
            mainMessage: parsedData.mainMessage,
            subMessage: parsedData.subMessage,
            luckyItem: parsedData.luckyItem,
          },
          shouldShow: parsedData.shouldShow,
        };
      }
    }

    const shouldShow = Math.random() < 0.3;
    const newFortune = createNewFortune();

    const dataToStore: IStoredIFortuneData = {
      ...newFortune,
      date: today,
      shouldShow,
    };

    localStorage.setItem(FORTUNE_STORAGE_KEY, JSON.stringify(dataToStore));

    return {
      fortune: shouldShow ? newFortune : null,
      shouldShow,
    };
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return {
      fortune: Math.random() < 0.9 ? createNewFortune() : null,
      shouldShow: Math.random() < 0.9,
    };
  }
};

export const markFortuneAsViewed = (): void => {
  try {
    const stored = localStorage.getItem(FORTUNE_STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored) as unknown;
      if (isIStoredIFortuneData(parsedData)) {
        const updatedData = { ...parsedData, hasViewed: true };
        localStorage.setItem(FORTUNE_STORAGE_KEY, JSON.stringify(updatedData));
      }
    }
  } catch (error) {
    console.error('Error marking fortune as viewed:', error);
  }
};
