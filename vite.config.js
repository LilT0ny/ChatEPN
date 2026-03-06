import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // VITE_BASE defaults to '/ChatEPN/' to keep GitHub Pages working.
  // Override with VITE_BASE=/ when building for Docker or other servers.
  const base = env.VITE_BASE ?? '/ChatEPN/'

  return {
    plugins: [react()],
    base,
    build: {
      outDir: 'docs',
    },
  }
})
