// What server components get for `import { … } from 'i18n-core'` (the "react-server"
// condition in package.json). See ./index for the client counterpart.
export * from './universal.js';
export { createI18nProvider } from './next-intl/i18n-provider.js';
export { createRequestConfig } from './next-intl/request.js';
