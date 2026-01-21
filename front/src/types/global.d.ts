export {};

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (apiKey: string) => void;
      Link: {
        sendDefault: (options: {
          objectType: 'feed';
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
    adfit?: {
      display: (unit: string) => void;
      destroy: (unit: string) => void;
      refresh: (unit: string) => void;
    };
  }
}
