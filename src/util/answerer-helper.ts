import type { IAnswererClassName, IChatIcon } from '@/types/Answer/types';

const getClassNameForAnswerer = (
  props: IAnswererClassName,
): string | undefined => {
  const { userId, correctAnswerer, diaryId, Style } = props;

  if (!correctAnswerer || !diaryId) {
    return undefined;
  }

  if (userId === correctAnswerer) {
    return Style.CorrectAnswerer;
  }

  return Style.Owner;
};

const getChatIcon = (props: IChatIcon): string | null => {
  const { user, correctAnswerer, diaryId } = props;

  if (!correctAnswerer || !diaryId) {
    return null;
  }

  const isDiaryOwner = correctAnswerer === diaryId;
  const isMyAnswer = user._id === correctAnswerer;
  const hasRoom = !!user.roomId;

  if (isDiaryOwner) {
    if (hasRoom) {
      return '💬';
    } else {
      return '✉️';
    }
  }

  if (!isDiaryOwner) {
    if (!isMyAnswer) {
      return null;
    }

    if (hasRoom) {
      return '💬';
    } else {
      return '✉️';
    }
  }

  return null;
};

// 답장 단계별 기준점 (StepEmoji와 동일)
const MILESTONE_REQUIREMENTS = [
  3, 5, 7, 9, 11, 13, 15, 17, 19, 25, 30, 40, 55, 75, 99,
];

/**
 * 현재 답장 개수 이하의 기준점 중 가장 큰 값을 찾습니다.
 * @param answererCount 총 답장 개수
 * @returns 가장 최근 달성한 기준점, 없으면 null
 */
const getLatestMilestone = (answererCount: number): number | null => {
  for (let i = MILESTONE_REQUIREMENTS.length - 1; i >= 0; i--) {
    if (answererCount >= MILESTONE_REQUIREMENTS[i]) {
      return MILESTONE_REQUIREMENTS[i];
    }
  }
  return null;
};

/**
 * 게임 아이콘을 반환합니다.
 * 다이어리 주인이거나 자신의 답변인 경우에만 게임 버튼이 표시됩니다.
 */
const getGameIcon = (props: IChatIcon): string | null => {
  const { user, correctAnswerer, diaryId } = props;

  if (!correctAnswerer || !diaryId) {
    return null;
  }

  const isDiaryOwner = correctAnswerer === diaryId;
  const isMyAnswer = user._id === correctAnswerer;

  // 다이어리 주인이거나 자신의 답변인 경우 게임 버튼 표시
  if (isDiaryOwner || isMyAnswer) {
    return '🎮';
  }

  return null;
};

export {
  getChatIcon,
  getClassNameForAnswerer,
  getGameIcon,
  getLatestMilestone,
  MILESTONE_REQUIREMENTS,
};
