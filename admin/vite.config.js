import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const adminRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: adminRoot,
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
  },
  preview: {
    port: 4175,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
  },
})
