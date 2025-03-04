import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
const SURL = 'http://localhost:3000/'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240, // 仅压缩大于 10KB 的文件
    deleteOriginFile: true, // 是否删除原始文件
  })],
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
    extensions: ['.js', '.vue', '.json', '.ts', '.jsx', '.tsx', '.mjs', '.html']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
          return 'other'
        },
      },
    },
  },
})
