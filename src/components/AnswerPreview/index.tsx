import Style from './style.module.scss';

interface Props {
  answers: string[];
}

const AnswerReviewList = (props: Props) => {
  const { answers } = props;

  return (
    <div className={Style.Layout}>
      <div className={Style.Wrapper}>
        {answers.map((answer, idx) => (
          <div className={Style.Content} key={idx}>
            <div className={Style.Title}>💬 {idx + 1}번째 답변</div>
            <div>{answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerReviewList;
