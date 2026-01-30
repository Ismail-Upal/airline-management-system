/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        airline: {
          primary: '#1e40af',   // Deep Blue
          secondary: '#60a5fa', // Sky Blue
          accent: '#facc15'    // Warning/Gold
        }
      }
    },
  },
  plugins: [],
}
