/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: "#25E6FF",
          300: "#72F6FF"
        }
      },
      animation: {
        "spin-slow": "spin 12s linear infinite"
      }
    },
  },
  plugins: [],
}
