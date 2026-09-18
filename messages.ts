import { DEFAULT_LOCALE, type Locale } from './config';
import { type Namespace, NAMESPACES } from './namespaces';

type MessageTree = Record<string, unknown>;

// One file per namespace per locale, merged back into the single object next-intl expects.
// Splitting them keeps the catalogs mergeable when several people edit copy at once, and
// lets a client boundary ship only the namespaces a route actually renders.
async function loadNamespace(locale: Locale, namespace: Namespace): Promise<MessageTree> {
  try {
    return (await import(`../../../messages/${locale}/${namespace}.json`)).default;
  } catch {
    // An untranslated namespace falls back to the default locale rather than rendering
    // raw keys — a half-translated language stays usable.
    if (locale !== DEFAULT_LOCALE) {
      return loadNamespace(DEFAULT_LOCALE, namespace);
    }
    return {};
  }
}

export async function loadMessages(locale: Locale): Promise<MessageTree> {
  const loaded = await Promise.all(
    NAMESPACES.map(
      async (namespace) => [namespace, await loadNamespace(locale, namespace)] as const,
    ),
  );
  return Object.fromEntries(loaded);
}

// Narrows a full catalog to the namespaces a client boundary needs. Everything passed to
// NextIntlClientProvider is serialised into the HTML, so a page should ask for the two or
// three namespaces it renders rather than all 29.
export function pickMessages(messages: MessageTree, namespaces: readonly Namespace[]): MessageTree {
  return Object.fromEntries(
    namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );
}
