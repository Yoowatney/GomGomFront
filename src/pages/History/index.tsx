import { AxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getHistoryDiary, getNextHistoryDiary } from '@/api/History/history';
import CustomModal from '@/components/Modal/CustomModal';
import { useModal } from '@/hooks/useModal';
import type { IHistoryItem } from '@/types/History/types';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const History = () => {
  const [historyList, setHistoryList] = useState<IHistoryItem[]>([]);
  const [originNext, setOriginNext] = useState('');

  const [isFetching, setIsFetching] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const historyListRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { openModal, modalContent, isOpen, closeModal } = useModal();

  useEffect(() => {
    const fetchHistoryDiary = async () => {
      try {
        setIsLoading(true);
        const response = await getHistoryDiary();

        if (response.historyList.length === 0) {
          openModal({
            title: '⚠️ 알림',
            description: '저장된 다이어리가 없어요.',
            onConfirmCallback: closeModal,
          });
        } else {
          setHistoryList(response.historyList);
          setOriginNext(response.next);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          openModal({
            title: '⚠️ 오류',
            description: '저장된 다이어리가 없어요.',
            onConfirmCallback: closeModal,
          });
        }
        console.error('Failed to fetch history diary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    EventTrigger({
      action: '히스토리 페이지 진입',
      category: 'history',
      label: '히스토리 페이지 진입',
      value: 1,
    });

    void fetchHistoryDiary();
  }, [closeModal, openModal]);

  const fetchMoreHistoryDiary = useCallback(async () => {
    if (isFetching || isEnd || !originNext) return;

    try {
      setIsFetching(true);
      const response = await getNextHistoryDiary(originNext);

      if (response.historyList.length > 0) {
        setHistoryList((prevList) => [...prevList, ...response.historyList]);
        setOriginNext(response.next);

        if (!response.next) {
          setIsEnd(true);
        }
      } else {
        setIsEnd(true);
      }
    } catch (error) {
      console.error('Failed to fetch more history:', error);
      setIsEnd(true);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, isEnd, originNext]);

  const handleScroll = useCallback(() => {
    const container = historyListRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !isFetching &&
      !isEnd
    ) {
      void fetchMoreHistoryDiary();
    }
  }, [fetchMoreHistoryDiary, isFetching, isEnd]);

  useEffect(() => {
    const container = historyListRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className={Style.Layout}>
      <div className={Style.Title}>
        <div className={Style.Emoji}>📮</div>
        <div className={Style.Desc}>
          저장된 다이어리를
          <br />
          확인해보라곰!
        </div>
      </div>

      <div
        className={`${Style.HistoryList} ${historyList.length === 0 ? Style.EmptyHistoryList : ''}`}
        ref={historyListRef}
      >
        {historyList.map((historyItem, index) => (
          <ul
            key={historyItem._id}
            className={Style.HistoryItem}
            onClick={() => void navigate(`/history/${historyItem._id}`)}
          >
            <div>
              💌 {index + 1}번째 다이어리 답장 수:
              {historyItem.numberOfAnswerers}
            </div>
            <div>{new Date(historyItem.createdAt).toLocaleDateString()}</div>
          </ul>
        ))}

        {isFetching && (
          <div className={Style.Description}>다이어리를 불러오는 중...</div>
        )}

        {isEnd && !isFetching && historyList.length > 0 && (
          <div className={Style.Description}>더 이상 다이어리가 없어요.</div>
        )}
      </div>

      {isLoading && (
        <div className={Style.Description}>다이어리를 불러오는 중...</div>
      )}

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
    </div>
  );
};

export default History;
