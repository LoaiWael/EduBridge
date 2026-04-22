/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface RegisterSWOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegisterError?: (error: any) => void;
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisteredSW?: (swUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: any) => void;
}

interface RegisterSWResult {
  updateSW: (reloadPage?: boolean) => Promise<void>;
}

declare module 'virtual:pwa-register' {
  export function registerSW(options?: RegisterSWOptions): RegisterSWResult;
}