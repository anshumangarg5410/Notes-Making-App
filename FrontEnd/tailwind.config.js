/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5F1E9',
          200: '#EBE5D8',
          300: '#DFD7C4',
          400: '#CFC3AA',
          500: '#B8A88A',
        },
        warm: {
          bg: '#F6F3ED',
          sidebar: '#EFEBE3',
          card: '#FFFFFF',
          cardHover: '#FBF9F5',
          border: '#E5DFD5',
          borderSubtle: '#EDE8E0',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#636363',
          600: '#484848',
          700: '#33312E',
          800: '#23211F',
          900: '#181715',
          950: '#0F0E0D',
        },
        terracotta: {
          50: '#FDF4F0',
          100: '#FCE7DF',
          200: '#F9D0C1',
          300: '#F4B09B',
          400: '#EB886D',
          500: '#C85A32',
          600: '#BA4E26',
          700: '#9B3E1C',
          800: '#80341B',
          900: '#6B2F1B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card': '0 2px 6px -1px rgba(35, 33, 31, 0.05), 0 2px 4px -2px rgba(35, 33, 31, 0.03)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
