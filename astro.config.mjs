import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://bharani-studio-stories.syedcode07.chatgpt.site',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  devToolbar: { enabled: false },
});
