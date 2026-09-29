import {
  type I18nConfig,
  isSupportedLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_SOURCE_COOKIE,
  type LocaleSource,
} from './config.js';

// Client-side writers for the locale cookie read by the request config
// (i18n-core/next-intl/server). Callers refresh the router afterwards so server components
// re-render with the new catalog. Browser only: these touch `document.cookie`.

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

function readCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export interface LocaleCookies<L extends string> {
  /** A language the viewer picked themselves; it wins over any organization default. */
  setUserLocale(locale: L): void;
  /** Forgets the viewer's pick so the organization default applies again. */
  clearUserLocale(): void;
  /**
   * Applies an organization's default language unless the viewer has picked their own.
   * Returns true when the cookie changed, i.e. the caller should refresh.
   */
  applyAppLocale(orgLocale: string | null | undefined, current: string): boolean;
}

export function createLocaleCookies<L extends string>(
  config: I18nConfig<L, string>,
): LocaleCookies<L> {
  function writeLocale(locale: L, source: LocaleSource) {
    writeCookie(LOCALE_COOKIE, locale, LOCALE_COOKIE_MAX_AGE);
    writeCookie(LOCALE_SOURCE_COOKIE, source, LOCALE_COOKIE_MAX_AGE);
  }

  return {
    setUserLocale(locale) {
      writeLocale(locale, 'user');
    },
    clearUserLocale() {
      writeCookie(LOCALE_SOURCE_COOKIE, 'org', LOCALE_COOKIE_MAX_AGE);
    },
    applyAppLocale(orgLocale, current) {
      if (readCookie(LOCALE_SOURCE_COOKIE) === 'user') {
        return false;
      }
      if (!isSupportedLocale(config, orgLocale) || orgLocale === current) {
        return false;
      }
      writeLocale(orgLocale, 'org');
      return true;
    },
  };
}
