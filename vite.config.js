import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
  }
})
