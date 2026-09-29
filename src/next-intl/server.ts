// Server-only next-intl wiring: the request config the next-intl plugin loads, and the
// provider that passes catalogs to client components. Kept apart from the hooks in
// `i18n-core/next-intl` because it imports next/headers, which client bundles can't.
export { createI18nProvider, type I18nProviderProps } from './i18n-provider.js';
export { createRequestConfig } from './request.js';
