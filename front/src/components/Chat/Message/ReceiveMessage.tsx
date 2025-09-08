import type { IChatMessageInfo } from '@/types/Chat/types';

import Style from './Style.module.scss';

const ReceiveMessage = (props: IChatMessageInfo) => {
  const { nickname, chat, createdAt } = props;

  const time = new Date(createdAt).toLocaleString('ko-kr', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className={`${Style.MessageContainer} ${Style.ReceiveMessage}`}>
      <div className={Style.Receiver}>🐻 {nickname}</div>
      <div className={Style.MessageWrapper}>{chat}</div>
      <div className={Style.ReceiveTime}>{time}</div>
    </div>
  );
};

export default ReceiveMessage;
