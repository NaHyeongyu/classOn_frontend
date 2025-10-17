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
  }
})
