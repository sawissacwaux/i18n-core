import type { createI18nProvider as serverCreateI18nProvider } from './i18n-provider.js';
import type { createRequestConfig as serverCreateRequestConfig } from './request.js';

// Client-side stand-ins for the server wiring. Importing them is fine — an app's i18n
// barrel is shared by server and client components — but calling one outside a server
// component is a bug. The type-only imports above keep the real modules, and next/headers
// with them, out of the client bundle.

function serverOnly(name: string): never {
  throw new Error(`[i18n] ${name} only works in server components.`);
}

export const createRequestConfig: typeof serverCreateRequestConfig = () =>
  serverOnly('createRequestConfig');

export const createI18nProvider: typeof serverCreateI18nProvider = () =>
  serverOnly('createI18nProvider');
