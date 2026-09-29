import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';

import type { I18nConfig } from '../config.js';
import { type MessageTree, pickMessages } from '../messages.js';

export interface I18nProviderProps<N extends string> {
  /**
   * Namespaces this subtree's client components render. Everything listed is serialised
   * into the HTML, so ask for the two or three a route actually uses rather than all of them.
   */
  namespaces: readonly N[];
  children: ReactNode;
}

/**
 * Server component that hands a subtree's client components the catalogs they need.
 * `config` only fixes the namespace type: `export default createI18nProvider(i18nConfig)`.
 */
export function createI18nProvider<N extends string>(_config: I18nConfig<string, N>) {
  return async function I18nProvider({ namespaces, children }: I18nProviderProps<N>) {
    const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

    return (
      <NextIntlClientProvider
        locale={locale}
        messages={pickMessages(messages as MessageTree, namespaces)}
      >
        {children}
      </NextIntlClientProvider>
    );
  };
}
