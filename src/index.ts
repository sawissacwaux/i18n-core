// Framework-free core: config, locale cookies, message loading and formatting. Safe to
// import from client and server code alike. The next-intl bindings live in
// `i18n-core/next-intl` (hooks) and `i18n-core/next-intl/server` (request config, provider),
// so a change of translation library is confined to those two entry points.
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
