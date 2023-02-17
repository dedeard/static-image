const colors = require('tailwindcss/colors')
const config = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './docs/**/*.{html,md}',
    './*.{html,md}',
  ],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1024px',
        xl: '1024px',
        lg: '1024px',
        md: '768px',
        sm: '640px',
      },
    },
    extend: {
      colors: {
        primary: colors.indigo,
      },
      fontFamily: {
        serif: ['Montserrat', ...config.fontFamily.serif],
        sans: ['Montserrat', ...config.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
