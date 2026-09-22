// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site. Update `site` to your GitHub username and `base`
  // to your repo name if they differ.
  site: 'https://deep-dive.avetavos.com',
  base: '/python',
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
        { tag: 'script', attrs: { type: 'module', src: '/python/enhance.js' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/python/manifest.webmanifest' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/python/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/python/icon-192.png' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#FFD43B' } },
        { tag: 'meta', attrs: { name: 'mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' } },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: "Python Deep Dive" } },
        { tag: 'script', content: "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/python/sw.js',{scope:'/python/'}).catch(function(){})})}" },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/avetavos/python-deep-dive' }],
      sidebar: [
        { label: 'Basics & Syntax', translations: { th: 'พื้นฐานและ Syntax' }, items: [{ autogenerate: { directory: 'basics' } }] },
        { label: 'Data Structures', translations: { th: 'โครงสร้างข้อมูล' }, items: [{ autogenerate: { directory: 'data-structures' } }] },
        { label: 'OOP & the Data Model', translations: { th: 'OOP และ Data Model' }, items: [{ autogenerate: { directory: 'oop-data-model' } }] },
        { label: 'Functions In Depth', translations: { th: 'Function เชิงลึก' }, items: [{ autogenerate: { directory: 'functions-deep' } }] },
        { label: 'Typing & Errors', translations: { th: 'Typing และ Error' }, items: [{ autogenerate: { directory: 'typing-errors' } }] },
        { label: 'Async & Concurrency', translations: { th: 'Async และ Concurrency' }, items: [{ autogenerate: { directory: 'async-concurrency' } }] },
        { label: 'Stdlib, Testing & Tooling', translations: { th: 'Stdlib, Testing และ Tooling' }, items: [{ autogenerate: { directory: 'stdlib-testing-tooling' } }] },
        { label: 'Runtime Internals', translations: { th: 'กลไกภายใน Runtime' }, items: [{ autogenerate: { directory: 'runtime-internals' } }] },
        { label: 'Reading & Reviewing Python', translations: { th: 'อ่านและรีวิวโค้ด Python' }, items: [{ autogenerate: { directory: 'reading-python' } }] },
        { label: 'Glossary', translations: { th: 'อภิธานศัพท์' }, link: 'glossary' },
      ],
      }), preact()],
});