import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || 'EccomerceProject/',  
  server: {
    proxy: {
      '/api': {
        target:'http://localhost:3000'
      },
      '/images': {
        target:'http://localhost:3000'
      }
    }
  }
})
