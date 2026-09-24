// The only i18n import path for application code.
//
// Everything below is re-exported rather than used directly so that a change of
// translation library is confined to this folder: `providers`-level wiring lives in
// ./request and ./i18n-provider, and call sites never name the library. An ESLint rule
// enforces that — see `no-restricted-imports` in .eslintrc.json.
//
// Ported module — keep identical across faculty_backend, student_web and
// organization_portal. Only ./config's locale list and ./namespaces differ per portal.
export { type Locale } from './config';
export { applyAppLocale, clearUserLocale, setUserLocale } from './locale-cookie';
export { NAMESPACES } from './namespaces';
export { useLocale, useTranslations } from 'next-intl';
