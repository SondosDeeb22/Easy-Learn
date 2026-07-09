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
  // const env = loadEnv(mode, '.');
  console.log(`[vite.conifg] env.vite_backend_api_url: ${process.env.VITE_BACKEND_API_URL}`)

  return {
    plugins: [react()],

    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },

    envPrefix: ['VITE_'],


    server: {
      port: Number(process.env.VITE_FRONTEND_PORT),
      allowedHosts: true,

      proxy: {
        "/api": {
          target: process.env.VITE_BACKEND_API_URL,
          changeOrigin: true,
        }
      }
    }
  }
})
