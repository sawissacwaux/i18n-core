import { DEFAULT_LOCALE, type Locale } from './config';

// Number and date formatting belong to the same contract as messages: both change with the
// viewer's locale, and both were hardcoded to en-US before. `locale` defaults so the
// existing synchronous call sites keep working; pass `useLocale()` from a component to make
// a value follow the active language.

export function formatNumber(
  value: number,
  options: { decimal?: boolean; locale?: Locale | string } & Intl.NumberFormatOptions = {},
): string {
  const { decimal = true, locale = DEFAULT_LOCALE, ...intlOptions } = options;
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimal ? 2 : 0,
    maximumFractionDigits: decimal ? 2 : 0,
    ...intlOptions,
  });
}

export function formatDate(
  value: Date | string | number,
  options: { locale?: Locale | string } & Intl.DateTimeFormatOptions = {},
): string {
  const { locale = DEFAULT_LOCALE, ...intlOptions } = options;
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...intlOptions,
  }).format(date);
}
