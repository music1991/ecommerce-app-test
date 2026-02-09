/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta línea es la más importante
  ],
  theme: {
    extend: {
      colors: {
        'artemisa': '#D1B3FF', // El lila de tus capturas
      }
    },
  },
  plugins: [],
}