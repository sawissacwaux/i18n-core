// Number and date formatting belong to the same contract as messages: both change with the
// viewer's locale. `locale` defaults to English so synchronous call sites that have no
// locale at hand keep working; pass `useLocale()` from a component to make a value follow
// the active language.

const FALLBACK_LOCALE = 'en';

export function formatNumber(
  value: number,
  options: { decimal?: boolean; locale?: string } & Intl.NumberFormatOptions = {},
): string {
  const { decimal = true, locale = FALLBACK_LOCALE, ...intlOptions } = options;
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimal ? 2 : 0,
    maximumFractionDigits: decimal ? 2 : 0,
    ...intlOptions,
  });
}

export function formatDate(
  value: Date | string | number,
  options: { locale?: string } & Intl.DateTimeFormatOptions = {},
): string {
  const { locale = FALLBACK_LOCALE, ...intlOptions } = options;
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...intlOptions,
  }).format(date);
}
