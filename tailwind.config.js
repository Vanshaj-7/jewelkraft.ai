/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F6F6F6',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          500: '#8B5CF6',
          600: '#7C3AED',
          800: '#6B21A8',
        },
        gray: {
          50: '#FAF9FB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          900: '#23272A',
        },
        white: '#FFFFFF',
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
          50: '#F8FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#E5E4E2',
          400: '#C0C0C0',
          500: '#A8A8A8',
          700: '#6B7280',
        },
        platinum: '#E5E4E2',
        charcoal: '#23272A',
        slate: '#374151',
        blush: {
          50: '#F5E9F7',
          100: '#F3E8EE',
        },
        lavender: {
          100: '#F3F4FD',
          200: '#E0E7FF',
          300: '#A5B4FC',
        },
        blue: {
          100: '#B6C7E6',
          200: '#B3B8DB',
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