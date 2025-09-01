/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0A0F14",
        surface: "#0F1620",
        primary: {
          DEFAULT: "#32E6FF", // Ghostify neon cyan
          50: "#E8FCFF",
          100: "#C9F7FF",
          200: "#92EEFF",
          300: "#5BE4FF",
          400: "#32E6FF",
          500: "#0FD8F3",
          600: "#0AB3CC",
          700: "#098BA1",
          800: "#0B6C7D",
          900: "#0E515F",
        },
        accent: "#63FFA7",
        Danger: "#FF4D6D",
        text: {
          primary: "#D6E2F0",
          muted: "#7C8BA1",
        },
        card: "#111A24",
        border: "#1E2A36",
      },
      boxShadow: {
        neon: "0 0 12px rgba(50,230,255,.45), inset 0 0 12px rgba(50,230,255,.15)",
        card: "0 8px 30px rgba(0,0,0,.35)",
      },
      dropShadow: {
        glow: ["0 0 8px #32E6FF", "0 0 16px rgba(50,230,255,.65)"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "24px",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        glow: {
          "0%,100%": { boxShadow: "0 0 10px rgba(50,230,255,.4)" },
          "50%": { boxShadow: "0 0 22px rgba(50,230,255,.7)" },
        },
        matrix: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        glow: "glow 3s ease-in-out infinite",
        matrix: "matrix 18s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
