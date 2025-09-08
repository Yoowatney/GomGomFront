import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getHistoryItemDetail } from '@/api/History/history';
import AnswerModal from '@/components/Modal/AnswerModal';
import CustomModal from '@/components/Modal/CustomModal';
import Pagination from '@/components/Pagination';
import StepEmoji from '@/components/StepEmoji';
import { useModal } from '@/hooks/useModal';
import type { IAnswerData } from '@/types/History/types';

import Style from './style.module.scss';

const HistoryItem = () => {
  const { historyItemId } = useParams();
  const { isOpen, openModal, modalContent, closeModal } = useModal();

  const [questioner, setQuestioner] = useState('');
  const [challenge, setChallenge] = useState('');
  const [numOfAnswerers, setNumOfAnswerers] = useState(0);
  const [answerList, setAnswerList] = useState<IAnswerData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  useEffect(() => {
    if (historyItemId) {
      const fetchHistoryItemDetail = async () => {
        try {
          const response = await getHistoryItemDetail(
            currentPage,
            historyItemId,
          );

          setQuestioner(response.questioner);
          setNumOfAnswerers(response.numberOfAnswerers);
          setChallenge(response.challenge);
          setAnswerList(response.answerList);
          setTotalPages(Math.ceil(response.numberOfAnswerers / 5));
        } catch (e) {
          console.log(e);
        }
      };
      void fetchHistoryItemDetail();
    }
  }, [currentPage, historyItemId]);

  const handleOpen = (person: IAnswerData) => {
    openModal({
      title: `${person.answerer}님의 답장 💌`,
      children: <AnswerModal person={person} />,
      onConfirmCallback: closeModal,
    });
  };

  return (
    <div className={Style.Layout}>
      <StepEmoji answererCount={numOfAnswerers} />
      <div className={Style.HistoryItemInfo}>
        <div className={Style.Questioner}>{questioner}님의 다이어리</div>
        <div>내가 설정한 암호: [{challenge}]</div>
      </div>

      <div className={Style.AnswerList}>
        {answerList.map((person) => (
          <ul
            key={person._id}
            className={Style.Answerer}
            onClick={() => handleOpen(person)}
          >
            <div>{person.answerer} 님의 답장</div>
            <div className={Style.CreatedAt}>
              {new Date(person.createdAt).toLocaleDateString()}
            </div>
          </ul>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        generatePageNumbers={generatePageNumbers}
        handlePageClick={handlePageClick}
      />

      {isOpen && modalContent && (
        <CustomModal
          title={modalContent.title}
          onConfirm={() => {
            if (modalContent.onConfirmCallback) {
              modalContent.onConfirmCallback();
            }
          }}
        >
          {modalContent.children}
        </CustomModal>
      )}
    </div>
  );
};
export default HistoryItem;
