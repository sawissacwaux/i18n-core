// The only import path: `import { … } from 'i18n-core'`.
//
// package.json maps it per environment. Server components (the "react-server" condition)
// get ./index.server, with the real request config and provider. Everything else — client
// components, SSR of client components, plain Node — gets this file, where those two are
// stubs, so next/headers never ends up in a client bundle. Both files export the same names
// with the same types.
export * from './universal.js';
export { createI18nProvider, createRequestConfig } from './next-intl/server-stubs.js';
