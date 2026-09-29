# i18n-core

A small i18n toolkit for Next.js App Router apps, built on [next-intl](https://next-intl.dev).

- The locale is stored in a cookie, so URLs don't need a `/[locale]` prefix.
- Translations live in one JSON file per namespace per locale.
- A missing translation file falls back to the default locale.
- Hooks are typed with your own locales and namespaces.
- Optional: load translations from a remote URL, so you can change copy without a redeploy.

## Install

The package is private, so install it from git:

```bash
npm install git+https://github.com/sawissacwaux/i18n-core.git
npm install git+https://github.com/sawissacwaux/i18n-core.git#v2.0.0   # pin a version
```

You also need `next-intl@^4`, `next>=15` and `react>=19` in your app.

npm 11+ asks you to approve the package's build script once:

```bash
npm approve-scripts i18n-core
```

## Quick start

The examples below keep all i18n files in `src/i18n/`. Any folder works.

### 1. Add your translations

```text
messages/
  en/
    common.json      { "save": "Save" }
    home.json        { "title": "Welcome" }
  ja/
    common.json      { "save": "保存" }
```

`ja/home.json` is missing, so Japanese users see the English `home` text.

### 2. Define your locales and namespaces

```ts
// src/i18n/config.ts
import { defineI18nConfig, type LocaleOf } from 'i18n-core';

export const i18nConfig = defineI18nConfig({
  locales: ['en', 'ja'],
  defaultLocale: 'en',
  namespaces: ['common', 'home'],
});

export type Locale = LocaleOf<typeof i18nConfig>; // 'en' | 'ja'
```

### 3. Tell next-intl where the messages are

```ts
// src/i18n/request.ts
import { createRequestConfig } from 'i18n-core/next-intl/server';

import { i18nConfig } from './config';

export default createRequestConfig(i18nConfig, {
  loadBundled: (locale, namespace) =>
    import(`../../messages/${locale}/${namespace}.json`).then((m) => m.default),
});
```

```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl({
  /* your Next.js config */
});
```

### 4. Create the hooks and the provider

```ts
// src/i18n/index.ts — the one import path for app code
import { createLocaleCookies } from 'i18n-core';
import { createI18nHooks } from 'i18n-core/next-intl';

import { i18nConfig } from './config';

export { type Locale } from './config';
export { formatDate, formatNumber } from 'i18n-core';
export const { useLocale, useTranslations } = createI18nHooks(i18nConfig);
export const { setUserLocale, clearUserLocale, applyAppLocale } = createLocaleCookies(i18nConfig);
```

```ts
// src/i18n/provider.tsx
import { createI18nProvider } from 'i18n-core/next-intl/server';

import { i18nConfig } from './config';

export default createI18nProvider(i18nConfig);
```

### 5. Wrap your app

```tsx
// src/app/layout.tsx
import I18nProvider from '@/i18n/provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <I18nProvider namespaces={['common', 'home']}>{children}</I18nProvider>
      </body>
    </html>
  );
}
```

`namespaces` lists what **client** components under this provider need. Those messages are sent to the browser, so keep the list short. Server components can read every namespace.

### 6. Translate

```tsx
import { useTranslations } from '@/i18n';

export function Title() {
  const t = useTranslations('home');
  return <h1>{t('title')}</h1>;
}
```

### 7. Switch language

```tsx
'use client';
import { useRouter } from 'next/navigation';

import { setUserLocale } from '@/i18n';

export function JapaneseButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        setUserLocale('ja');
        router.refresh(); // re-render server components with the new language
      }}
    >
      日本語
    </button>
  );
}
```

## How messages are loaded

On every request, the library:

1. Reads the `locale` cookie. If it's missing or not in `locales`, it uses `defaultLocale`.
2. Calls your `loadBundled(locale, namespace)` once for each namespace in the config.
3. If a file is missing, it loads the default locale's file for that namespace instead. If that's missing too, it uses `{}`.

The library never scans the `messages/` folder itself. It only calls your `loadBundled` function. The import path has to stay in your app so the bundler can find and bundle the JSON files.

| You add | Loaded? |
| --- | --- |
| A file for an existing locale and namespace, e.g. `messages/ja/home.json` | Yes, after a rebuild (or a dev server restart) |
| A new namespace, e.g. `messages/en/billing.json` | Only after you add `'billing'` to `namespaces` |
| A new locale folder, e.g. `messages/fr/` | Only after you add `'fr'` to `locales` |

Fallback works per file, not per key. If `ja/home.json` exists but is missing a key, that key isn't taken from English.

## Default language from settings

You might have a default language that isn't the user's own choice, for example from an organization or tenant setting. Apply it with `applyAppLocale`:

```tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { applyAppLocale, useLocale } from '@/i18n';

export function DefaultLanguage({ language }: { language?: string }) {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Returns true only when the cookie changed.
    if (applyAppLocale(language, locale)) router.refresh();
  }, [language, locale, router]);

  return null;
}
```

A language the user picked with `setUserLocale` always wins over it. `clearUserLocale()` forgets the user's pick, so the default applies again.

## Type-safe keys

To make typos in namespaces and keys compile errors, describe your English messages to next-intl:

```ts
// global.d.ts
import type common from './messages/en/common.json';
import type home from './messages/en/home.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: { common: typeof common; home: typeof home };
  }
}
```

After that, `useTranslations('home')('titel')` is a type error.

## Remote messages (optional)

Point `remoteBaseUrl` at a folder laid out like `messages/`. Remote text is merged over the bundled text:

```ts
export default createRequestConfig(i18nConfig, {
  loadBundled: /* … */,
  remoteBaseUrl: process.env.I18N_MESSAGES_URL, // e.g. https://cdn.example.com/messages
});
```

- The library fetches `<remoteBaseUrl>/<locale>/<namespace>.json`.
- Each file is fetched once per server process. Restart the server to pick up new text.
- A 404 means "no override". Any other error logs a warning and keeps the bundled text.
- Leave it unset in production if you don't want runtime fetches.

## API

### `i18n-core`

Works anywhere; it doesn't depend on any framework.

| Export | What it does |
| --- | --- |
| `defineI18nConfig({ locales, defaultLocale, namespaces })` | Creates the config the other functions take. Throws if `defaultLocale` isn't in `locales`. |
| `LocaleOf<typeof config>`, `NamespaceOf<typeof config>` | The locale and namespace union types. |
| `resolveLocale(config, value)` | Returns `value` if it's supported, otherwise `defaultLocale`. |
| `isSupportedLocale(config, value)` | Type guard for a supported locale. |
| `createLocaleCookies(config)` | Returns `setUserLocale`, `clearUserLocale` and `applyAppLocale`. Browser only. |
| `createMessageLoader(config, { loadBundled, remoteBaseUrl })` | Returns `loadMessages(locale)` for use outside next-intl, e.g. in scripts or emails. |
| `pickMessages(messages, namespaces)` | Keeps only the listed namespaces. |
| `formatNumber(value, { decimal, locale, ...Intl.NumberFormatOptions })` | `1234.5` → `"1,234.50"`. Pass `decimal: false` for no decimals. |
| `formatDate(value, { locale, ...Intl.DateTimeFormatOptions })` | `"Sep 29, 2026"` in `en`. |
| `LOCALE_COOKIE`, `LOCALE_SOURCE_COOKIE`, `LOCALE_COOKIE_MAX_AGE` | Cookie names (`locale`, `locale_source`) and their lifetime (1 year). |

`formatNumber` and `formatDate` use `en` unless you pass `locale`. Pass `locale: useLocale()` to follow the active language.

### `i18n-core/next-intl`

Works in client components and in non-async server components.

| Export | What it does |
| --- | --- |
| `createI18nHooks(config)` | Returns `useLocale()` (typed as your locales) and `useTranslations(namespace?)`. |

### `i18n-core/next-intl/server`

Server only.

| Export | What it does |
| --- | --- |
| `createRequestConfig(config, { loadBundled, remoteBaseUrl })` | The request config for next-intl. Default-export it from the file you pass to `createNextIntlPlugin`. |
| `createI18nProvider(config)` | A server component, `<I18nProvider namespaces={[…]}>`, that passes messages to client components. |

## Installing from a local folder

`npm install ../i18n-core` creates a symlink. Your app then loads a second copy of `next-intl` from `i18n-core/node_modules`, and `useTranslations` can't find the provider. Use one of these instead:

```bash
npm install --install-links ../i18n-core    # copies instead of symlinking
# or
cd ../i18n-core && npm pack                 # then: npm install ../i18n-core/i18n-core-2.0.0.tgz
```

## Develop

```bash
npm install
npm run build       # compile to dist/
npm run typecheck   # type-check without emitting
```
