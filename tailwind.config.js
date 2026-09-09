/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Editorial Light Palette
        ivory: {
          DEFAULT: '#F5F2EA', // Main warm background
          light: '#FAF8F3',   // Soft cream / card surface
          dark: '#EFEBE1',    // Warm linen / secondary surface
          deep: '#E5DFD3',    // Deeper warm tone
        },
        charcoal: {
          DEFAULT: '#171614', // Primary text
          light: '#2D2B27',   // Slightly lighter charcoal
          muted: '#6F6A61',   // Secondary text
          faint: '#9E978C',   // Muted captions / timecodes
        },
        champagne: {
          DEFAULT: '#B99A67', // Subtle champagne / muted gold
          light: '#DEC5A3',
          dark: '#9E8055',
        },
        border: {
          warm: '#D9D3C8',    // Soft warm gray border
          subtle: 'rgba(23, 22, 20, 0.08)',
        },
        // Dark legacy tokens preserved for Hero overlay
        dark: {
          DEFAULT: '#080808',
          950: '#050505',
          900: '#0B0B0C',
          850: '#111114',
          800: '#17171C',
          700: '#23232A',
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
    },
  },
  plugins: [],
}
