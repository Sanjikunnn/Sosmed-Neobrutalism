/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,html}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#39FF14',
        dark: '#0d0d0d',
        brutalPink: '#ff00aa',
        brutalYellow: '#ffee00',
      },
      fontFamily: {
        brutal: ['"Comic Neue"', 'cursive']
      }
    },
  },
  plugins: [],
}
