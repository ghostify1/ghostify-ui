module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { glow:"#00E5FF", ink:"#0a0f14", panel:"#0f1722", muted:"#8aa9b8" },
      fontFamily: { orbitron:["Orbitron","ui-sans-serif"], poppins:["Poppins","ui-sans-serif"] },
      boxShadow: { neon:"0 0 24px rgba(0,229,255,.35)" }
    }
  },
  plugins: []
}
