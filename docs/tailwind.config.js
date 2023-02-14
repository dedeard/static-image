/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './docs/**/*.{html,md}',
    './*.{html,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
