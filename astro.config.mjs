// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site. Update `site` to your GitHub username and `base`
  // to your repo name if they differ.
  site: 'https://avetavos.github.io',
  base: '/python-deep-dive',
  output: 'static',
  integrations: [starlight({
      title: 'Python Deep Dive',
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        th: { label: 'ไทย', lang: 'th' },
      },
      customCss: ['./src/styles/custom.css'],
      head: [
        { tag: 'script', attrs: { type: 'module', src: '/python-deep-dive/enhance.js' } },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/avetavos/python-deep-dive' }],
      sidebar: [
        { label: 'Basics & Syntax', items: [{ autogenerate: { directory: 'basics' } }] },
        { label: 'Data Structures', items: [{ autogenerate: { directory: 'data-structures' } }] },
        { label: 'OOP & the Data Model', items: [{ autogenerate: { directory: 'oop-data-model' } }] },
        { label: 'Functions In Depth', items: [{ autogenerate: { directory: 'functions-deep' } }] },
        { label: 'Typing & Errors', items: [{ autogenerate: { directory: 'typing-errors' } }] },
        { label: 'Async & Concurrency', items: [{ autogenerate: { directory: 'async-concurrency' } }] },
        { label: 'Stdlib, Testing & Tooling', items: [{ autogenerate: { directory: 'stdlib-testing-tooling' } }] },
      ],
      }), preact()],
});