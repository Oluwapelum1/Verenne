import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Verenne/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // The WebGL scene (three.js) is lazy-loaded as its own chunk after first paint.
    chunkSizeWarningLimit: 1100,
  },
})
