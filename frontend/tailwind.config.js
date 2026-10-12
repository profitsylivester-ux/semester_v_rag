/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gemini: { bg: '#131314', panel: '#1e1f20', bubble: '#282a2c', border: '#2f3133', accent: '#a8c7fa', muted: '#9aa0a6' }
      }
    }
  },
  plugins: []
}
