/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 Tailwind scans ALL React files here
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};