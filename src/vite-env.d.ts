/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_CLOUD?: string;
  readonly VITE_ADMIN_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
