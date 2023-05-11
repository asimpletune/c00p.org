/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.html', './static/**/*.{html,js}'],
  theme: {
    extend: {},
    backgroundImage: {}
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

