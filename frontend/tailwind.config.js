/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'homebg': "url('/frontend/public/bg.png')",
      }
    },
  },
  plugins: [],
}

