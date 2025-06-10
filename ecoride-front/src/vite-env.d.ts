/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // ajoute d'autres variables ici si besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
