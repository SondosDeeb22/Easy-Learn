// ============================================
//? import
// ============================================

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
// ============================================

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  // Load env variables 
  const env = loadEnv(mode, '.');

  return {
    plugins: [react()],

    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },

    envPrefix: ['VITE_'],


    server: {
      port: Number(env.VITE_FRONTEND_PORT) || 3001,
      allowedHosts: true,

      proxy: {
        // Proxy auth endpoints directly to NestJS backend
        "/auth": {
          target: env.VITE_BACKEND_API_URL || "http://localhost:3000",
          changeOrigin: true,
        },
      }
    }
  }
})
