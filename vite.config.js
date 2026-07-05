import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5180,
    host: true,
    open: false
  },
  appType: 'spa'
});
