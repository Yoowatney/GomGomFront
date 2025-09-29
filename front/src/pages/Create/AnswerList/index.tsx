import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AnswerListSection from '@/components/AnswerList';
import CustomModal from '@/components/Modal/CustomModal';
import { GOMGOM_HOMEPAGE_URL } from '@/constant/url';
import useAnswerList from '@/hooks/useAnswerList';
import useDiaryOwnerStatus from '@/hooks/useDiaryOwnerStatus';
import { useModal } from '@/hooks/useModal';
import { getCookie } from '@/util/cookie-helper';

import Style from './style.module.scss';

const AnswerList = () => {
  const { diaryAddress } = useParams();

  const isDiaryOwner = useDiaryOwnerStatus(diaryAddress ?? '');
  const correctAnswerer = getCookie('diaryAddress');
  const { openModal, isOpen, modalContent, closeModal } = useModal();

  const {
    answererList,
    answererCount,
    isConnected,
    currentPage,
    totalPages,
    handlePageClick,
    generatePageNumbers,
    handleSelectSortOrder,
    sortOrder,
    handleDisplayResponse,
    error,
    resetError,
    chatNotAllow,
    resetChatNotAllow,
    chatCreated,
    resetChatCreated,
    chatCreationError,
    resetChatCreationError,
    chatOwnerRequired,
    resetChatOwnerRequired,
    handleOpenChat,
  } = useAnswerList(diaryAddress ?? '');

  const handleModalConfirm = useCallback(() => {
    resetError();
    closeModal();
  }, [closeModal, resetError]);

  useEffect(() => {
    const today = new Date().toDateString();
    const hideEventModalUntil = localStorage.getItem('hideEventModalUntil');

    if (hideEventModalUntil === today) {
      return;
    }

    const handleHideToday = () => {
      localStorage.setItem('hideEventModalUntil', today);
      closeModal();
    };

    openModal({
      title: '🎉 이벤트가 진행중이라곰!',
      children: (
        <div style={{ textAlign: 'center' }}>
          <img
            src="/image/event/share_event.webp"
            alt="이벤트 이미지"
            style={{ width: '100%', maxWidth: '300px' }}
          />
          <div
            onClick={handleHideToday}
            style={{
              marginTop: '8px',
              color: '#999',
              fontSize: '12px',
              cursor: 'pointer',
              userSelect: 'none',
              textAlign: 'right',
            }}
          >
            오늘은 그만보기
          </div>
        </div>
      ),
      confirmTitle: '보러가기',
      cancelTitle: '닫기',
      onConfirmCallback: () => {
        window.location.href = 'https://www.instagram.com/p/DPLOIl6kui3/?utm_source=ig_web_copy_link';
      },
      onCancelCallback: () => {
        closeModal();
      },
    });
  }, []);

  useEffect(() => {
    if (chatCreationError) {
      openModal({
        title: '오류',
        children: (
          <div className={Style.Description}>
            <div>채팅방 생성에 실패했습니다.</div>
          </div>
        ),
        onConfirmCallback: () => {
          resetChatCreationError();
          closeModal();
        },
      });
    }
  }, [chatCreationError, openModal, closeModal, resetChatCreationError]);

  useEffect(() => {
    if (chatOwnerRequired) {
      openModal({
        title: '안내',
        children: (
          <div className={Style.Description}>
            <div>다이어리 주인이 먼저 채팅방을 열어야 합니다.</div>
          </div>
        ),
        onConfirmCallback: () => {
          resetChatOwnerRequired();
          closeModal();
        },
      });
    }
  }, [chatOwnerRequired, openModal, closeModal, resetChatOwnerRequired]);

  useEffect(() => {
    if (chatCreated) {
      openModal({
        title: '안내사항',
        children: (
          <div className={Style.Description}>
            <div>채팅방이 생성되었습니다.</div>
          </div>
        ),
        onConfirmCallback: () => {
          resetChatCreated();
          closeModal();
        },
      });
    }
  }, [chatCreated, openModal, closeModal, resetChatCreated]);

  useEffect(() => {
    if (chatNotAllow) {
      openModal({
        title: '안내사항',
        children: (
          <div className={Style.Description}>
            <div>
              다이어리 주인이 먼저 채팅방을 만들어야 해요.
              <br />
              <br />
              채팅방이 만들어지면 '채팅하기'로 바뀌니,
              <br />
              채팅방이 만들어질 때까지 기다려주세요 :)
            </div>
          </div>
        ),
        onConfirmCallback: () => {
          resetChatNotAllow();
          closeModal();
        },
      });
    }
  }, [chatNotAllow, openModal, closeModal, resetChatNotAllow]);

  useEffect(() => {
    if (error === 'UNAUTHORIZED') {
      openModal({
        title: '안내사항',
        children: (
          <div className={Style.Description}>
            <div>다이어리 주인이 아니면 볼 수 없어요.</div>
            <div>
              ⚠️ 주인인데도 확인이 안된다면,
              <br />
              다이어리를 만든 곳에서 확인해주세요!
            </div>
            <div>
              ⚠️ 도움이 필요하다면,
              <br />
              <a href={GOMGOM_HOMEPAGE_URL} className={Style.Link}>
                공식 페이지
              </a>
              를 확인해주세요.
            </div>
          </div>
        ),
        onConfirmCallback: () => void handleModalConfirm(),
      });
    }
  }, [error, handleModalConfirm, openModal]);

  return (
    <div className={Style.Layout}>
      {isConnected ? (
        <>
          <AnswerListSection
            answererList={answererList}
            answererCount={answererCount}
            handleSelectSortOrder={handleSelectSortOrder}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageClick={handlePageClick}
            generatePageNumbers={generatePageNumbers}
            handleDisplayResponse={handleDisplayResponse}
            handleOpenChat={handleOpenChat}
            correctAnswerer={correctAnswerer}
            diaryId={diaryAddress ?? ''}
            sortOrder={sortOrder}
            isDiaryOwner={isDiaryOwner}
            error={error}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}

      {isOpen && modalContent && (
        <CustomModal
          title={modalContent.title}
          description={modalContent.description}
          children={modalContent.children}
          onConfirm={() => {
            if (modalContent.onConfirmCallback) {
              modalContent.onConfirmCallback();
            }
          }}
          onCancel={modalContent.onCancelCallback}
          confirmTitle={modalContent.confirmTitle}
          cancelTitle={modalContent.cancelTitle}
        />
      )}
    </div>
  );
};
export default AnswerList;
