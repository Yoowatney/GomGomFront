import ReceiveMessage from '@/components/Chat/Message/ReceiveMessage';
import SendMessage from '@/components/Chat/Message/SendMessage';
import Input from '@/components/Input';
import CustomModal from '@/components/Modal/CustomModal';
import { useChat } from '@/hooks/Chat/useChat';

import Style from './style.module.scss';

const Chat = () => {
  const {
    message,
    messages,
    saveMessages,
    isEnd,
    loading,
    scrollContainerRef,
    handleMessageInput,
    handleMessageSend,
    handleScroll,
    isOpen,
    modalContent,
  } = useChat();

  return (
    <div className={Style.Main}>
      <div className={Style.Chat}>
        <div
          className={Style.ChatContainer}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {loading && saveMessages.length >= 5 && (
            <div
              className={`${Style.ChatAlarm} ${
                isEnd ? Style.Hidden : Style.Alarm
              }`}
            >
              {isEnd ? null : '스크롤을 움직여 이전 메세지를 확인해보세요.'}
            </div>
          )}

          {saveMessages.map((msg, i) => (
            <div className={Style.MessageWrapper} key={`saved-${msg._id}-${i}`}>
              {msg.isSender ? (
                <SendMessage
                  nickname={msg.nickname}
                  chat={msg.chat}
                  createdAt={msg.createdAt}
                />
              ) : (
                <ReceiveMessage
                  nickname={msg.nickname}
                  chat={msg.chat}
                  createdAt={msg.createdAt}
                />
              )}
            </div>
          ))}

          {messages.map((msg, i) => (
            <div className={Style.MessageWrapper} key={`live-${msg._id}-${i}`}>
              {msg.isSender ? (
                <SendMessage
                  nickname={msg.nickname}
                  chat={msg.chat}
                  createdAt={msg.createdAt}
                />
              ) : (
                <ReceiveMessage
                  nickname={msg.nickname}
                  chat={msg.chat}
                  createdAt={msg.createdAt}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {isOpen && modalContent && (
        <CustomModal
          title={modalContent.title}
          description={modalContent.description}
          onConfirm={() => {
            if (modalContent.onConfirmCallback) {
              modalContent.onConfirmCallback();
            }
          }}
        />
      )}
      <Input
        className={Style.MessageInput}
        value={message}
        onChange={handleMessageInput}
        onKeyUp={handleMessageSend}
        placeholder="100자 내로 입력해주세요."
      />
    </div>
  );
};

export default Chat;
