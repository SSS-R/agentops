import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/agents': 'http://localhost:3000',
      '/approvals': 'http://localhost:3000',
      '/notifications': 'http://localhost:3000',
      '/health': 'http://localhost:3000'
    }
  }
})
