// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 백엔드 서버(http://127.0.0.1:5000)로 전달합니다.
      '/api': 'http://127.0.0.1:5000'
    }
  }
})
