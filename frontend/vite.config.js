// ============================================
//? import
// ============================================

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
// ============================================

export default defineConfig(({ mode }) => {


  console.log(`[vite.conifg] env.vite_backend_api_url: ${process.env.VITE_BACKEND_API_URL}`)

  return {
    plugins: [react()],

    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },

    envPrefix: ['VITE_'],

  }
})
