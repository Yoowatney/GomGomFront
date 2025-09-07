import type { IAnswerData } from '@/types/History/types';

import Style from './style.module.scss';

interface Props {
  person: IAnswerData;
}

const AnswerModal = (props: Props) => {
  const { person } = props;

  return (
    <div className={Style.Layout}>
      <div className={Style.Wrapper}>
        {person.answers.map((answer, idx) => (
          <div className={Style.Content} key={idx}>
            <div className={Style.Title}>💬 {idx + 1}번째 답변</div>
            <div>{answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AnswerModal;
