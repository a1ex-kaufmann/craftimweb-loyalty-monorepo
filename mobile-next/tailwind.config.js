/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          200: '#E9D5FF',
          400: '#C084FC'
        },
        yellow: {
          200: '#FEF08A',
          400: '#FACC15'
        },
        blue: {
          200: '#BFDBFE',
          400: '#60A5FA'
        },
        pink: {
          200: '#FBCFE8',
          400: '#F472B6'
        }
      }
    }
  },
  plugins: [],
} 