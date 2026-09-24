import { DEFAULT_LOCALE, type Locale } from './config';
import type { Namespace } from './namespaces';

type MessageTree = Record<string, unknown>;

// One file per locale (messages/<locale>.json), each keyed by namespace — the shape
// next-intl expects, so it is used as-is.
async function loadLocale(locale: Locale): Promise<MessageTree> {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    return {};
  }
}

export async function loadMessages(locale: Locale): Promise<MessageTree> {
  const messages = await loadLocale(locale);
  if (locale === DEFAULT_LOCALE) {
    return messages;
  }
  // An untranslated namespace falls back to the default locale rather than rendering
  // raw keys — a half-translated language stays usable.
  return { ...(await loadLocale(DEFAULT_LOCALE)), ...messages };
}

// Narrows a full catalog to the namespaces a client boundary needs. Everything passed to
// NextIntlClientProvider is serialised into the HTML, so a page should ask for the two or
// three namespaces it renders rather than all 29.
export function pickMessages(messages: MessageTree, namespaces: readonly Namespace[]): MessageTree {
  return Object.fromEntries(
    namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );
}
