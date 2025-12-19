/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BRIEF_TIMEOUT_MS?: string;
  readonly VITE_RENDER_TIMEOUT_MS?: string;
  readonly VITE_APP_LOGO_PATH?: string;
  // Optional: override billing clientKey on the frontend (billingKey flow only).
  // Do NOT put secretKey/securityKey in the frontend.
  readonly VITE_TOSS_BILLING_CLIENT_KEY?: string;
  // Legacy alias (some local setups used this name).
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
