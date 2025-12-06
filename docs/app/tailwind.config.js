/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        foreground: '#f1f5f9',
        muted: {
          DEFAULT: '#1e293b',
          foreground: '#94a3b8',
        },
        primary: {
          DEFAULT: '#38bdf8',
          foreground: '#020617',
        },
        secondary: {
          DEFAULT: '#a855f7',
          foreground: '#020617',
        },
        accent: {
          DEFAULT: '#22c55e',
          foreground: '#020617',
        },
        border: '#334155',
        card: {
          DEFAULT: '#0f172a',
          foreground: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
