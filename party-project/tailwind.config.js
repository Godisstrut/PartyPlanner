/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Lato", "sans-serif"],
      },
      colors: {
        mauve: {
          50:  "#faf8f9",
          100: "#f3eef1",
          200: "#e8dde4",
          300: "#d4bfcc",
          400: "#b896aa",
          500: "#9c7090",
          600: "#7d5474",
          700: "#5e3d57",
          800: "#3f2a3c",
          900: "#201520",
        },
        rose: {
          50:  "#fff1f3",
          100: "#ffe0e4",
          200: "#ffc7cf",
          300: "#ffa0ae",
          400: "#ff6b82",
          500: "#f83b58",
          600: "#e51d41",
          700: "#c11236",
          800: "#a11233",
          900: "#891331",
        },
        gold: {
          300: "#e8d5a3",
          400: "#d4b96a",
          500: "#b8973a",
          600: "#96791e",
        },
        cream: {
          50:  "#fdfaf5",
          100: "#faf4e8",
          200: "#f5ebd4",
        },
      },
    },
  },
  plugins: [],
}