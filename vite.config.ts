import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'
// EN: Vite dev proxy for backend API to avoid CORS in development
// KO: 개발 중 CORS 회피를 위한 백엔드 API 프록시 설정

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefer env files colocated with frontend; fall back to monorepo root when absent
  const envCandidates = [
    `.env.${mode}.local`,
    `.env.${mode}`,
    `.env.local`,
    `.env`,
  ];
  const hasLocalEnv = envCandidates.some((file) => fs.existsSync(path.resolve(__dirname, file)));
  const envDir = hasLocalEnv ? __dirname : path.resolve(__dirname, '..');

  return {
    plugins: [react()],
    envDir,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
        watch: { // Vite가 주기적으로 디렉토리를 직접 스캔해서 변경 감지
            usePolling: true,
            interval: 300, // 0.3초마다 변경 감지
        },
      proxy: {
        // Proxy API during dev to avoid CORS issues
        '/api': {
          target: 'http://backend:8080',
          changeOrigin: true,
          secure: false,
        },
        // Proxy output/static served by Spring if needed
      },
    },
      test: {
          globals: true,
          environment: 'jsdom',
          setupFiles: './src/setupTests.ts',
          include: ['src/**/*.spec.{ts,tsx}'],
      },
  }
})
