// Shared i18n constants and the per-portal config. Everything that differs between
// portals — the locale list, the default locale and the namespace list — lives in the
// config object each app passes to the factories in this package; everything else is fixed.

export const LOCALE_COOKIE = 'locale';

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Who set the `locale` cookie. 'user' means the viewer picked a language themselves, and an
// organization's default must not override it; 'org' (or absent) means it may.
export const LOCALE_SOURCE_COOKIE = 'locale_source';

export type LocaleSource = 'user' | 'org';

export interface I18nConfig<L extends string = string, N extends string = string> {
  /**
   * Every language the app offers. A locale without catalog files falls back to
   * `defaultLocale` per namespace (see ./messages), so a language can be switched on
   * before its catalogs exist.
   */
  readonly locales: readonly L[];
  readonly defaultLocale: L;
  /** Catalog namespaces, one file per namespace per locale. */
  readonly namespaces: readonly N[];
}

export type LocaleOf<C> = C extends I18nConfig<infer L, string> ? L : never;

export type NamespaceOf<C> = C extends I18nConfig<string, infer N> ? N : never;

/**
 * Declares an app's config. The `const` type parameters keep the literal unions, so
 * `LocaleOf<typeof config>` is `'en' | 'ja' | …` rather than `string`.
 */
export function defineI18nConfig<const L extends string, const N extends string>(config: {
  locales: readonly L[];
  defaultLocale: NoInfer<L>;
  namespaces: readonly N[];
}): I18nConfig<L, N> {
  if (!config.locales.includes(config.defaultLocale)) {
    throw new Error(
      `[i18n] defaultLocale '${config.defaultLocale}' is not one of: ${config.locales.join(', ')}`,
    );
  }
  return Object.freeze({
    locales: Object.freeze([...config.locales]),
    defaultLocale: config.defaultLocale,
    namespaces: Object.freeze([...config.namespaces]),
  });
}

export function isSupportedLocale<L extends string>(
  config: I18nConfig<L, string>,
  value: string | null | undefined,
): value is L {
  return !!value && config.locales.includes(value as L);
}

/** `value` when the app supports it, otherwise the default locale. */
export function resolveLocale<L extends string>(
  config: I18nConfig<L, string>,
  value: string | null | undefined,
): L {
  return isSupportedLocale(config, value) ? value : config.defaultLocale;
}
