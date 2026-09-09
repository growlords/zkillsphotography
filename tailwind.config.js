/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#080808',
          950: '#050505',
          900: '#0B0B0C',
          850: '#111114',
          800: '#17171C',
          700: '#23232A',
        },
        champagne: {
          DEFAULT: '#C6A87D',
          light: '#DEC5A3',
          dark: '#9E8055',
        },
        pearl: {
          DEFAULT: '#F5F4F0',
          muted: '#A5A5A9',
          faint: 'rgba(245, 244, 240, 0.65)',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'widest-xl': '0.25em',
        'widest-2xl': '0.35em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
