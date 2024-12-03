/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        bm: {
          blue: "#2563EB",
          purple: "#98A4EE",
        },
        grayscale: {
          800: "#2F3044",
          700: "#343549",
          600: "#424358",
          500: "#565868",
          400: "#7e7e96",
          300: "#9c9e9f",
          200: "#d5d5d5",
          100: "#eaf1fb",
        },
      },
    },
  },
  plugins: [],
};
