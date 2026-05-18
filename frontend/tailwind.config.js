/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold:    "#D4A017",
        "gold-dim": "#3a2e00",
        "gold-bg":  "#1c1700",
        dark:    "#0a0a0a",
        "dark-2": "#0d0d0d",
        "dark-3": "#111111",
        "dark-border": "#1e1e1e",
        "green-id": "#4caf7d",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}