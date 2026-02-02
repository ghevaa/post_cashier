/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#13ec5b",
        "primary-dark": "#0eb545",
        "background-light": "#f8fcf9",
        "background-dark": "#102216",
        "surface-light": "#ffffff",
        "surface-dark": "#1a3324",
        "text-main": "#0d1b12",
        "text-muted": "#4c9a66",
        "border-color": "#cfe7d7",
        "secondary-green": "#e7f3eb",
        "secondary-green-dark": "#1e3a29",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
  plugins: [],
}
