/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BRIEF_TIMEOUT_MS?: string;
  readonly VITE_RENDER_TIMEOUT_MS?: string;
  readonly VITE_APP_LOGO_PATH?: string;
  readonly VITE_TOSS_CLIENT_KEY?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SSR: boolean;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
