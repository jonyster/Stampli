/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        stampliPink: "#D61E8C",
        stampliIndigo: "#3B4294",
      },
    },
  },
  plugins: [],
};
