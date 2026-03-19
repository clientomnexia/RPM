/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          950: '#4a0e0e',
          900: '#8B2635',
          800: '#9b1c1c', // Adjusted to match provided UI
        },
        amber: {
          600: '#d97706',
          500: '#f59e0b',
        },
        stone: {
          950: '#0c0a09',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
