/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_SERVER_URL: string;
  readonly VITE_APP_GOOGLE_ANALYTICS_TRACKING_ID: string;
  readonly VITE_APP_KAKAO_API: string;
  readonly VITE_APP_CHAT_WS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
