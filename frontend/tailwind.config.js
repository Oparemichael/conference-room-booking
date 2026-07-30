/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind scans React files here
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f4ff',
          100: '#e6e9ff',
          200: '#c7ccff',
          300: '#9ea8ff',
          400: '#7b86ff',
          DEFAULT: '#5b6eff',
          600: '#4956f0',
          700: '#3846d1',
          800: '#2a36a8',
          900: '#1f257c',
        },
        surface: '#f8fafc',
        muted: '#6b7280',
        accent: '#aa3bff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.06)',
        elev: '0 6px 20px rgba(16, 24, 40, 0.08)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
};