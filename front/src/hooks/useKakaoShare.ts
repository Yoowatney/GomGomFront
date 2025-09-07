import { useCallback } from 'react';

interface IKakaoShareParams {
  title: string;
  description: string;
  imageUrl: string;
  diaryAddress: string;
  location?: string;
  buttonTitle?: string;
}

interface IKakaoShare {
  shareKakaoLink: (params: IKakaoShareParams) => void;
}

const useKakaoShare = (): IKakaoShare => {
  const shareKakaoLink = useCallback(
    ({
      title,
      description,
      imageUrl,
      diaryAddress,
      location = window.location.origin,
      buttonTitle = '답장하기',
    }: IKakaoShareParams): void => {

      if (!window.Kakao) {
        console.error('KakaoTalk SDK가 로드되지 않았습니다.');
        return;
      }

      const Kakao = window.Kakao;
      const kakaoAPI = import.meta.env.VITE_APP_KAKAO_API;

      if (!kakaoAPI) {
        console.error('KAKAO API 키가 설정되지 않았습니다.');
        return;
      }

      if (!Kakao.isInitialized()) {
        Kakao.init(kakaoAPI);
      }

      Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl,
          link: {
            mobileWebUrl: `${location}/diary/${diaryAddress}`,
            webUrl: `${location}/diary/${diaryAddress}`,
          },
        },
        buttons: [
          {
            title: buttonTitle,
            link: {
              mobileWebUrl: `${location}/diary/${diaryAddress}`,
              webUrl: `${location}/diary/${diaryAddress}`,
            },
          },
        ],
      });
    },
    [],
  );

  return { shareKakaoLink };
};

export default useKakaoShare;
