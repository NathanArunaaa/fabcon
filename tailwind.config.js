/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  darkMode: 'class',

  content: ["./src/**/*.{html,js}", "node_modules/flowbite-react/lib/esm/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
]
}