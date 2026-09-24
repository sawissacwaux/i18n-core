import {
  isSupportedLocale,
  type Locale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_SOURCE_COOKIE,
  type LocaleSource,
} from './config';

// Client-side writers for the locale cookie read by ./request. Callers refresh the router
// afterwards so server components re-render with the new catalog.

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

function readCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function writeLocale(locale: Locale, source: LocaleSource) {
  writeCookie(LOCALE_COOKIE, locale, LOCALE_COOKIE_MAX_AGE);
  writeCookie(LOCALE_SOURCE_COOKIE, source, LOCALE_COOKIE_MAX_AGE);
}

/** A language the viewer picked themselves; it wins over any organization default. */
export function setUserLocale(locale: Locale) {
  writeLocale(locale, 'user');
}

/** Forgets the viewer's pick so the organization default applies again. */
export function clearUserLocale() {
  writeCookie(LOCALE_SOURCE_COOKIE, 'org', LOCALE_COOKIE_MAX_AGE);
}

/**
 * Applies an organization's default language unless the viewer has picked their own.
 * Returns true when the cookie changed, i.e. the caller should refresh.
 */
export function applyAppLocale(orgLocale: string | null | undefined, current: string): boolean {
  if (readCookie(LOCALE_SOURCE_COOKIE) === 'user') {
    return false;
  }
  if (!isSupportedLocale(orgLocale ?? undefined) || orgLocale === current) {
    return false;
  }
  writeLocale(orgLocale as Locale, 'org');
  return true;
}
