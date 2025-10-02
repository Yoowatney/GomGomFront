import type { IAnswerer, IAnswerListSection } from '@/types/Answer/types';
import {
  getChatIcon,
  getClassNameForAnswerer,
  getLatestMilestone,
} from '@/util/answerer-helper';

import Style from './style.module.scss';

type AnswererListProps = Pick<
  IAnswerListSection,
  | 'answererList'
  | 'answererCount'
  | 'diaryId'
  | 'correctAnswerer'
  | 'handleDisplayResponse'
  | 'handleOpenChat'
  | 'sortOrder'
  | 'start'
>;

const AnswererList = (props: AnswererListProps) => {
  const {
    answererList,
    answererCount,
    handleDisplayResponse,
    handleOpenChat,
    diaryId,
    correctAnswerer,
    sortOrder,
    start,
  } = props;

  if (!answererList || answererList.length === 0) {
    return null; // 또는 EmptyAnswerList 컴포넌트를 여기서 렌더링
  }

  const latestMilestone = getLatestMilestone(answererCount);

  return (
    <div>
      {answererList.map((person: IAnswerer, index: number) => {
        // 전체 인덱스 계산 (1-based)
        // desc: 최신이 위 (answererCount - (start + index))
        // asc: 오래된 것이 위 (start + index + 1)
        const startNum = Number(start);
        const globalIndex: number =
          sortOrder === 'desc'
            ? answererCount - (startNum + index)
            : startNum + index + 1;
        const isFirstAnswer: boolean = globalIndex === 1;
        const shouldShowLevelUpBadge: boolean = latestMilestone === globalIndex;

        return (
          <div className={Style.ListTable} key={person._id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                position: 'relative',
              }}
            >
              {isFirstAnswer && (
                <img
                  src="/image/icon/badge-1st.svg"
                  alt="첫 번째 뱃지"
                  width={24}
                  height={24}
                  style={{
                    position: 'absolute',
                    left: 0,
                  }}
                />
              )}
              {!isFirstAnswer && shouldShowLevelUpBadge && (
                <img
                  src="/image/icon/badge-levelup.svg"
                  alt="레벨업 뱃지"
                  width={24}
                  height={24}
                  style={{
                    position: 'absolute',
                    left: 0,
                  }}
                />
              )}
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
                style={{
                  position: 'absolute',
                  right: 0,
                }}
              >
                {getChatIcon({ user: person, correctAnswerer, diaryId })}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnswererList;
