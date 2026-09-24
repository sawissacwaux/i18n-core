import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import React from 'react';

import { pickMessages } from './messages';
import type { Namespace } from './namespaces';

type I18nProviderProps = {
  /**
   * Namespaces this subtree's client components render. Everything listed is serialised
   * into the HTML, so ask for the two or three a route actually uses rather than all 29.
   */
  namespaces: readonly Namespace[];
  children: React.ReactNode;
};

// Framework wiring — one of the few files a library swap would rewrite.
const I18nProvider = async ({ namespaces, children }: I18nProviderProps) => {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pickMessages(messages as Record<string, unknown>, namespaces)}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default I18nProvider;
