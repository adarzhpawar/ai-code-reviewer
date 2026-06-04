/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          400: '#A3FF12',
          500: '#7DFF00',
        },
        surface: '#000000',
        'surface-light': '#0A0A0A',
        'surface-lighter': '#111111',
        border: '#222222',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'border-trace': 'border-trace 2s linear infinite',
        'pulse-lime': 'pulse-lime 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'type-cursor': 'type-cursor 0.8s step-end infinite',
      },
      keyframes: {
        'border-trace': {
          '0%': { borderColor: '#222' },
          '50%': { borderColor: '#A3FF12' },
          '100%': { borderColor: '#222' },
        },
        'pulse-lime': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(163, 255, 18, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(163, 255, 18, 0.4)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'type-cursor': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
