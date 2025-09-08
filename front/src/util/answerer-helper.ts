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

export { getChatIcon, getClassNameForAnswerer };
