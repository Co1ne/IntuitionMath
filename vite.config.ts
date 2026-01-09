import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Fix: Import process from node:process to provide proper Node.js types in the config environment
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // 加载环境变量（支持 .env 文件）
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // 关键：将系统环境变量注入到前端代码中
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'd3', 'mathjs', '@google/genai']
          }
        }
      }
    },
    server: {
      port: 3000
    }
  };
});
