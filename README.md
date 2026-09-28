# i18n-core

Private TypeScript package. Not published to the npm registry (`"private": true`), so install it from git or a local path.

## Install

```bash
# from GitHub (builds dist/ via the `prepare` script)
npm install git+https://github.com/sawissacwaux/i18n-core.git

# pin a tag or commit
npm install git+https://github.com/sawissacwaux/i18n-core.git#v0.1.0

# from a local checkout
npm install ../i18n-core
```

npm 11+ warns that `i18n-core` has an unreviewed `prepare` script. Approve it once in the consuming repo:

```bash
npm approve-scripts i18n-core
```

## Usage

```ts
import { helloWorld } from "i18n-core";

helloWorld();        // "Hello, World!"
helloWorld("Issac"); // "Hello, Issac!"
```

## Develop

```bash
npm install
npm run build
```
