/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        '128': '28rem',
        '76': '14rem',
        '64': '12rem'
      },
      height: {
        '128': '28rem',
        '86': '22rem',
        '76': '17rem',
        '66': '11rem',
        '64': '12rem',
        '20': '2rem',
        '30': '5rem'
      }
    },
  },
  plugins: [],
}
