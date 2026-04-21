import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const sellerRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: sellerRoot,
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
  },
})
