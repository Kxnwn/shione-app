/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Shione color palette
        'deep':   '#1B3A5C',
        'mid':    '#4A7FA5',
        'accent': '#6DB8D4',
        'soft':   '#A8CADE',
        'mist':   '#D9EDF7',
        'cloud':  '#F7FBFD',
      },
    },
  },
  plugins: [],
}