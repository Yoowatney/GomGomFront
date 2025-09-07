import type { IAnswerer, IAnswerListSection } from '@/types/Answer/types';
import { getChatIcon, getClassNameForAnswerer } from '@/util/answerer-helper';

import Style from './style.module.scss';

type AnswererListProps = Pick<
  IAnswerListSection,
  | 'answererList'
  | 'diaryId'
  | 'correctAnswerer'
  | 'handleDisplayResponse'
  | 'handleOpenChat'
>;

const AnswererList = (props: AnswererListProps) => {
  const {
    answererList,
    handleDisplayResponse,
    handleOpenChat,
    diaryId,
    correctAnswerer,
  } = props;

  if (!answererList || answererList.length === 0) {
    return null; // 또는 EmptyAnswerList 컴포넌트를 여기서 렌더링
  }

  return (
    <div>
      {answererList.map((person: IAnswerer) => (
        <div className={Style.ListTable} key={person._id}>
          <div
            onClick={() => void handleDisplayResponse(person._id)}
            className={getClassNameForAnswerer({
              userId: person._id,
              correctAnswerer: correctAnswerer,
              diaryId: diaryId,
              Style: Style,
            })}
          >
            {person.answerer} 님의 답장
          </div>
          <button
            className={Style.ChatIcon}
            onClick={() =>
              void handleOpenChat({
                answererId: person._id,
                roomId: person.roomId,
              })
            }
          >
            {getChatIcon({ user: person, correctAnswerer, diaryId })}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnswererList;
