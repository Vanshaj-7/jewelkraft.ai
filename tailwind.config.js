/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E5',
          100: '#FFF0C2',
          200: '#FFE099',
          300: '#FFD066',
          400: '#FFC033',
          500: '#D4AF37',
          600: '#B38728',
          700: '#936C1E',
          800: '#725214',
          900: '#51390A',
        },
        silver: {
          50: '#F8F9FA',
          100: '#EBEDF0',
          200: '#D7DCE1',
          300: '#C0C6CE',
          400: '#A9B1BB',
          500: '#C0C0C0',
          600: '#8D98A5',
          700: '#6F7A87',
          800: '#4D5761',
          900: '#2C333B',
        },
        luxury: {
          black: '#000000',
          white: '#FFFFFF',
          cream: '#F7F2E9',
          beige: '#E6DED1',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'product': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};