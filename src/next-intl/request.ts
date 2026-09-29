import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { type I18nConfig, LOCALE_COOKIE, resolveLocale } from '../config.js';
import { createMessageLoader, type MessageLoaderOptions } from '../messages.js';

/**
 * next-intl's per-request config: the locale comes from the `locale` cookie written by
 * `createLocaleCookies`, the messages from the app's bundled catalogs (plus the optional
 * remote override). Default-export the result from the file the next-intl plugin points at:
 *
 *   export default createRequestConfig(i18nConfig, { loadBundled, remoteBaseUrl });
 */
export function createRequestConfig<L extends string, N extends string>(
  config: I18nConfig<L, N>,
  messages: MessageLoaderOptions<L, N>,
) {
  const loadMessages = createMessageLoader(config, messages);

  return getRequestConfig(async () => {
    const store = await cookies();
    const locale = resolveLocale(config, store.get(LOCALE_COOKIE)?.value);

    return {
      locale,
      messages: await loadMessages(locale),
    };
  });
}
