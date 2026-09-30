// Everything that runs in both server and client components. The two entry points,
// ./index (client) and ./index.server (react-server), re-export this file and differ only
// in the server wiring they add on top.
export {
  defineI18nConfig,
  type I18nConfig,
  isSupportedLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_SOURCE_COOKIE,
  type LocaleOf,
  type LocaleSource,
  type NamespaceOf,
  resolveLocale,
} from './config.js';
export { formatDate, formatNumber } from './format.js';
export { createLocaleCookies, type LocaleCookies } from './locale-cookie.js';
export {
  createMessageLoader,
  type MessageLoaderOptions,
  type MessageTree,
  pickMessages,
} from './messages.js';
export { createI18nHooks, type I18nHooks, type Translator } from './next-intl/hooks.js';
export type { I18nProviderProps } from './next-intl/i18n-provider.js';
