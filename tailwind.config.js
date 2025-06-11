/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // toggle dark mode manual
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
        // Ganti font jadi lebih gen-z & brutalist style
        brutal: ['"Rubik Mono One"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
