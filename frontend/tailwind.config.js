// ============================================================
//? Tailwind Config
// Colors sourced from src/styles/colors.js (single source of truth)
// ============================================================
import { colors } from './src/styles/colorPalette.ts';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: colors.burgundy,
          hover: colors.burgundyHover,
          dark: colors.burgundyDark,
        },
        background: colors.background,
        bgPrimary: colors.bgPrimary,
        bgHover: colors.bgHover,

        navbar: colors.navbar,
      },
    },
  },
  plugins: [],
}
