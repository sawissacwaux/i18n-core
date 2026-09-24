// The only i18n import path for application code.
//
// Everything below is re-exported rather than used directly so that a change of
// translation library is confined to this folder: `providers`-level wiring lives in
// ./request and ./client-provider, and call sites never name the library. An ESLint rule
// enforces that — see `no-restricted-imports` in .eslintrc.json.
//
// Ported module — keep identical across faculty_backend, student_web and
// organization_portal. Only ./config's locale list and ./namespaces differ per portal.
export {
  DEFAULT_LOCALE,
  I18N_MODULE_VERSION,
  isSupportedLocale,
  type Locale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_SOURCE_COOKIE,
  LOCALES,
  type LocaleSource,
} from './config';
export { formatDate, formatNumber } from './format';
export { applyAppLocale, clearUserLocale, setUserLocale } from './locale-cookie';
export { loadMessages, pickMessages } from './messages';
export { type Namespace, NAMESPACES } from './namespaces';
export { useFormatter, useLocale, useMessages, useTranslations } from 'next-intl';
export { getTranslations } from 'next-intl/server';
