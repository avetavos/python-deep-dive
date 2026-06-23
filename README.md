# Python Deep Dive

A bilingual (EN/TH), interactive, standalone course that teaches the **Python language** in depth — syntax, data structures, the object/data model, functions, typing & errors, async & concurrency, and the standard library. It is language-core focused (the language itself), not a framework tutorial.

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Site framework | [Astro 6](https://astro.build) + [Starlight 0.40](https://starlight.astro.build) |
| UI islands | [Preact](https://preactjs.com) (via `@astrojs/preact`) |
| Runnable code | **Pyodide** — Python compiled to WebAssembly runs in the browser; `<Playground>` executes editable snippets and shows output. No backend. |
| Unit tests | [Vitest](https://vitest.dev) + `@testing-library/preact` |
| Styling | Starlight default + custom CSS (`src/styles/custom.css`) |
| i18n | Starlight built-in, `defaultLocale: 'en'`, locales: `en` + `th` |

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Build production site to ./dist/
npm run preview    # Preview the production build locally
npm test           # Run Vitest unit tests
```

> No runner build step — Python runs in the browser via Pyodide (loaded from CDN on first Run).

## Content Structure

```
src/content/docs/
  en/                       # English — served at /en/...
    basics/
    data-structures/
    oop-data-model/
    functions-deep/
    typing-errors/
    async-concurrency/
    stdlib-testing-tooling/
    index.mdx               # EN landing (splash)
  th/                       # Thai — served at /th/...
    (same module directories)
    index.mdx               # TH landing (splash)
```

### The 7 Modules

| Directory | Module |
| --------- | ------ |
| `basics` | Basics & Syntax |
| `data-structures` | Data Structures |
| `oop-data-model` | OOP & the Data Model |
| `functions-deep` | Functions In Depth (closures, decorators, generators) |
| `typing-errors` | Typing & Errors |
| `async-concurrency` | Async & Concurrency |
| `stdlib-testing-tooling` | Stdlib, Testing & Tooling |

### Lesson Template

frontmatter (`title`, `description`, `sidebar.order`) → imports → concept intro → prose → hoisted `export const ...Code` + `<Playground code={...} />` → `<Callout>` (key point / gotcha) → `<Quiz>` → `<ProgressTracker>` (last). IDs follow `<module>/<slug>`.

> **⚠️ Authoring notes (Python + MDX):**
> - **Use 4-space indentation in `export const` Python snippets — never tab characters.** (A tab-doubling escaping codemod would corrupt indentation; do not run one.)
> - **Python string escapes inside `export const` template literals must be doubled**: write `\\n` / `\\t`. f-strings use single braces (`f"{x}"`) which are fine inside the backtick string.
> - **Never put a bare `{...}` or f-string in prose or headings** — MDX parses `{...}` as JS. Keep dict/set literals and f-strings in backtick code spans or fenced ```python blocks.
> - **Internal links must include the base path**, e.g. `/python-deep-dive/en/functions-deep/`.

### Pyodide notes

Pyodide runs pure Python plus much of the standard library (collections, itertools, functools, math, datetime, json, dataclasses, typing, re). It does **not** support `threading`/`multiprocessing`, and top-level `asyncio.run()` does not work (a loop is already running) — those lessons are shown as code with a "run locally" callout rather than a live runner.

## Deployment

Fully static (`output: 'static'`) → `dist/`. Deploys to GitHub Pages via `.github/workflows/deploy.yml` (build with `withastro/action` on Node 22, publish with `actions/deploy-pages`).

One-time setup: create the repo, push `main`, set **Settings → Pages → Source: GitHub Actions**. Base path in `astro.config.mjs`: `site: 'https://avetavos.github.io'`, `base: '/python-deep-dive'`. If you change `base`, update the base-prefixed links in `src/content/docs/{en,th}/index.mdx`.
