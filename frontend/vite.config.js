import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    // Allow ngrok and other external hosts
    allowedHosts: [
      '.ngrok-free.app',
      '.ngrok.io',
      '.ngrok.app',
      'localhost'
    ],
    hmr: {
      clientPort: 443
    },
    // Proxy API requests to backend services
    proxy: {
      '/api/students': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api/feedbacks': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      },
      '/api/admin': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
