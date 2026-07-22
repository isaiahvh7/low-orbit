import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/low-orbit/',
  worker: {
    format: 'es', // ES modules support top-level await; iife (default) doesn't
  },
  build: {
    target: 'esnext',
  },
})
