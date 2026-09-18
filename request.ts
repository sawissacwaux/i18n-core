import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE } from './config';
import { loadMessages } from './messages';

// Framework wiring — one of the few files a library swap would rewrite. Everything the
// app imports goes through ./index instead.
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get(LOCALE_COOKIE)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
