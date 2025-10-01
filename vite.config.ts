import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
// EN: Vite dev proxy for backend API to avoid CORS in development
// KO: 개발 중 CORS 회피를 위한 백엔드 API 프록시 설정

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Read env files from the monorepo root so `.env.production` at project root is picked up
  envDir: path.resolve(__dirname, '..'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // Proxy API during dev to avoid CORS issues
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy output/static served by Spring if needed
    },
  },
})
