import {
  type Messages,
  type NamespaceKeys,
  type NestedKeyOf,
  useLocale as useNextIntlLocale,
  useTranslations as useNextIntlTranslations,
} from 'next-intl';

import { type I18nConfig, resolveLocale } from '../config.js';

// App-facing hooks. Call sites get the app's own types (its locale and namespace unions)
// rather than next-intl's, so a library swap rewrites this file and nothing that calls it.
// No 'use client': next-intl's hooks also run in non-async server components.

// Namespaces next-intl knows about: the keys of the app's `AppConfig['Messages']`
// augmentation, or any string when the app declares none. The types below are written in
// terms of next-intl's own so they resolve in the app, where that augmentation is visible —
// message keys stay type-checked.
type KnownNamespace = NamespaceKeys<Messages, NestedKeyOf<Messages>>;

export type Translator<NS extends KnownNamespace = never> = ReturnType<
  typeof useNextIntlTranslations<NS>
>;

export interface I18nHooks<L extends string, N extends string> {
  /** The active language, narrowed to a locale the app supports. */
  useLocale(): L;
  /**
   * Translator for one namespace: `useTranslations('manage-courses')('header_page_title')`.
   * Without a namespace, keys are fully qualified: `'manage-courses.header_page_title'`.
   */
  useTranslations<NS extends N & KnownNamespace = never>(namespace?: NS): Translator<NS>;
}

export function createI18nHooks<L extends string, N extends string>(
  config: I18nConfig<L, N>,
): I18nHooks<L, N> {
  return {
    useLocale() {
      return resolveLocale(config, useNextIntlLocale());
    },
    useTranslations(namespace) {
      return useNextIntlTranslations(namespace);
    },
  };
}
