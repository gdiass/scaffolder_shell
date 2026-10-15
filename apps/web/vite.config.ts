import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: 'appstartHost',
      remotes: {
        tasksMfe: {
          type: 'module',
          name: 'tasksMfe', 
          entry: 'http://localhost:5174/remoteEntry.js', 
          entryGlobalName: 'tasksMfe',
          shareScope: 'default',
        },
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 1. ESPECÍFICO: Desvia chamadas de tarefas para o servidor do MFE na porta 5174
      '/api/v1/tasks': {
        target: 'http://localhost:5174', 
        changeOrigin: true,
        secure: false,
      },
      
      // 2. GENÉRICO: Mantém todo o restante das requisições (auth, login, etc) na sua API principal
      '/api': {
        target: process.env.API_BASE_URL || 'http://localhost:3100',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: process.env.API_BASE_URL || 'http://localhost:3100',
        changeOrigin: true,
      },
    },
  },
});
