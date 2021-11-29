const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {},
      animation: {},
    },
    colors: {
      ...colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
