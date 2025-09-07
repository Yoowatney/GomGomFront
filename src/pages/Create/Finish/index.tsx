import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import { ConfettiEffect } from '@/components/Confetti';
import CustomModal from '@/components/Modal/CustomModal';
import useKakaoShare from '@/hooks/useKakaoShare';
import { useModal } from '@/hooks/useModal';
import useValidateCreateStep from '@/hooks/useValidateCreateStep';
import { diaryAddressAtom } from '@/store/create';
import { getCookie } from '@/util/cookie-helper';
import { EventTrigger } from '@/util/ga-helper';
import { handleShareLink } from '@/util/share-helper';
import { setLocalStorage } from '@/util/storage-helper';

import Style from './style.module.scss';

const Finish = () => {
  const { isValid } = useValidateCreateStep('finish');

  const navigate = useNavigate();
  const { shareKakaoLink } = useKakaoShare();
  const { openModal, isOpen, modalContent, closeModal } = useModal();

  useEffect(() => {
    if (isValid) {
      ConfettiEffect();

      EventTrigger({
        action: '다이어리 완성 진입',
        category: 'create_funnel',
        label: '다이어리 완성 페이지',
        value: 1,
      });

      // NOTE: 기존 이벤트
      EventTrigger({
        action: '다이어리 완성하기',
        category: 'end',
        label: '다이어리 완성하기',
        value: 1,
      });
    }
  }, [isValid]);

  const [diaryAddress, setDiaryAddress] = useAtom(diaryAddressAtom);

  useEffect(() => {
    const diaryAddress = getCookie('diaryAddress');

    if (!diaryAddress) {
      return;
    }

    setDiaryAddress(diaryAddress);
    setLocalStorage('diaryAddress', diaryAddress);
  }, [setDiaryAddress]);

  const handleShareKakaoTalk = () => {
    shareKakaoLink({
      title: '곰곰 다이어리',
      description: '상대에 대해 곰곰이 생각하고 답해보세요!',
      imageUrl: `${window.location.origin}/image/thumbnail/OG_Thumb.png`,
      location: window.location.href,
      diaryAddress: diaryAddress,
    });
  };

  const handleCopyLink = () => {
    EventTrigger({
      action: '링크 공유하기',
      category: 'share',
      label: '링크 공유하기',
      value: 1,
    });

    openModal({
      title: '✅ 완료',
      description: '링크가 복사되었습니다.',
      onConfirmCallback: () => {
        handleShareLink(`${window.location.origin}/diary/${diaryAddress}`);
        closeModal();
      },
    });
  };

  const url = new URL(window.location.href);
  url.pathname = '';

  return (
    <div className={Style.Layout}>
      <div className={Style.Top}>
        <div className={Style.Emoji}>🎉</div>
        <div className={Style.Title}>곰곰 다이어리가 완성됐다곰!</div>
        <div>친구들에게 공유해 답장을 모아보세요!</div>
      </div>
      <div className={Style.Middle}>
        <div className={Style.Notice}>🐻 주의사항 🐻</div>
        <div>1. 자신의 다이어리 링크는 반드시 간직해주세요.</div>
        <div>2. 다이어리를 만든 곳/기기에서만 주인을 인식합니다.</div>
      </div>
      <Button
        className={Style.GoToAnswerList}
        color="default"
        onClick={() => void navigate(`/answerers/${diaryAddress}`)}
      >
        답장 보러 가기
      </Button>
      <div className={Style.Bottom}>
        <div className={Style.Buttons}>
          <button className={Style.Kakaotalk} onClick={handleShareKakaoTalk}>
            <img src="/image/icon/icon-KakaoTalk.svg" />
          </button>
          <button className={Style.LinkCopy} onClick={handleCopyLink}>
            <img src="/image/icon/icon-LinkCopy.svg" />
          </button>
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
          {...(modalContent.onCancelCallback && {
            onCancel: () => {
              if (modalContent.onCancelCallback) {
                modalContent.onCancelCallback();
              }
            },
          })}
        />
      )}
    </div>
  );
};

export default Finish;
