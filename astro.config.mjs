import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://amyxie.yiloo.cn',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap(), mdx()],
  server: { host: '127.0.0.1', port: 4321 },
});
