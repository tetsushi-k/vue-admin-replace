/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 80,
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
