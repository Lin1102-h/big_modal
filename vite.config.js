import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
const SURL = 'http://localhost:3000/'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/api': SURL,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 路径别名
    },
  },
})
