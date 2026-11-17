/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmos: {
          black: '#0D0D0D',
          surface: '#14161D',
          surfaceHover: '#1A1D28',
          electric: '#0511F2',
          ice: '#A7CFF2',
          yellow: '#F2E205',
          amber: '#F2A007',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Syne"', 'sans-serif'],
        sans: ['"Inter"', '"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'supernova-primary': '0 0 28px -4px rgba(242, 226, 5, 0.45), 0 0 12px -2px rgba(242, 160, 7, 0.35)',
        'supernova-secondary': '0 0 24px -4px rgba(167, 207, 242, 0.35), 0 0 12px -2px rgba(5, 17, 242, 0.4)',
        'supernova-card': '0 8px 32px -4px rgba(0, 0, 0, 0.7), 0 0 24px -8px rgba(5, 17, 242, 0.25)',
      }
    },
  },
  plugins: [],
}
