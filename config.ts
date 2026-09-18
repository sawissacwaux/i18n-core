// Shared i18n constants. Ported module — keep identical across faculty_backend,
// student_web and organization_portal; bump the version when any shared file changes.
export const I18N_MODULE_VERSION = '1.0.0';

export const LOCALES = ['en', 'ja', 'km', 'ms', 'my', 'th', 'zh'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE = 'locale';

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isSupportedLocale(value: string | undefined): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}
