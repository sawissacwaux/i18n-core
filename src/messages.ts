import type { I18nConfig } from './config.js';

export type MessageTree = Record<string, unknown>;

export interface MessageLoaderOptions<L extends string, N extends string> {
  /**
   * Loads one bundled catalog file and rejects when it doesn't exist. It has to live in the
   * app, not in this package, so the bundler can resolve the dynamic import against the
   * app's own messages folder:
   *
   *   (locale, namespace) =>
   *     import(`../../../messages/${locale}/${namespace}.json`).then((m) => m.default)
   */
  loadBundled: (locale: L, namespace: N) => Promise<MessageTree>;
  /**
   * Base URL of a remote copy laid out like messages/ (`<base>/<locale>/<namespace>.json`).
   * When set, remote copy overrides the bundled text, so copy changes need a restart rather
   * than a redeploy. Meant for dev; leave it unset in UAT and prod so they never fetch.
   */
  remoteBaseUrl?: string;
}

/**
 * Returns `loadMessages(locale)`: every namespace in the config, merged into the single
 * object next-intl expects (`{ [namespace]: catalog }`).
 */
export function createMessageLoader<L extends string, N extends string>(
  config: I18nConfig<L, N>,
  { loadBundled, remoteBaseUrl }: MessageLoaderOptions<L, N>,
): (locale: L) => Promise<MessageTree> {
  const remoteBase = remoteBaseUrl?.replace(/\/+$/, '') || undefined;

  async function loadBundledOrFallback(locale: L, namespace: N): Promise<MessageTree> {
    try {
      return await loadBundled(locale, namespace);
    } catch {
      // An untranslated namespace falls back to the default locale rather than rendering
      // raw keys — a half-translated language stays usable.
      if (locale !== config.defaultLocale) {
        return loadBundledOrFallback(config.defaultLocale, namespace);
      }
      return {};
    }
  }

  // Each remote file is fetched at most once per loader, i.e. once per server process: the
  // first request that needs it starts the fetch, concurrent and later requests share the
  // same promise. Picking up newly uploaded copy means restarting the server.
  const remoteOnce = new Map<string, Promise<MessageTree>>();

  function loadRemote(base: string, locale: L, namespace: N): Promise<MessageTree> {
    const url = `${base}/${locale}/${namespace}.json`;
    let pending = remoteOnce.get(url);
    if (!pending) {
      pending = fetch(url, { cache: 'no-store' })
        .then((res) => {
          if (res.status === 404) {
            return {};
          }
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json() as Promise<MessageTree>;
        })
        .catch((error: unknown) => {
          console.warn(`[i18n] could not load ${url}, using bundled messages:`, error);
          return {};
        });
      remoteOnce.set(url, pending);
    }
    return pending;
  }

  async function loadNamespace(locale: L, namespace: N): Promise<MessageTree> {
    const bundled = await loadBundledOrFallback(locale, namespace);
    if (!remoteBase) {
      return bundled;
    }
    const remote = await loadRemote(remoteBase, locale, namespace);
    return { ...bundled, ...remote };
  }

  return async function loadMessages(locale) {
    const loaded = await Promise.all(
      config.namespaces.map(
        async (namespace) => [namespace, await loadNamespace(locale, namespace)] as const,
      ),
    );
    return Object.fromEntries(loaded);
  };
}

// Narrows a full catalog to the namespaces a client boundary needs. Everything passed to
// the client provider is serialised into the HTML, so a page should ask for the few
// namespaces it renders rather than all of them.
export function pickMessages<N extends string>(
  messages: MessageTree,
  namespaces: readonly N[],
): MessageTree {
  return Object.fromEntries(
    namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );
}
