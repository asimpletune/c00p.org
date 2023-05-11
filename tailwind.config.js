/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./templates/**/*.html', './static/**/*.{html,js}'],
  theme: {
    extend: {},
    backgroundImage: {},
    fontFamily: {
      'playfair-display': ['Playfair Display', ...defaultTheme.fontFamily.serif],
      'fira-sans': ['Fira Sans', ...defaultTheme.fontFamily.sans],
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

