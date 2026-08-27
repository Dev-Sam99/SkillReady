/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
          950: '#052e16',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          800: '#18181b',
          900: '#09090b',
          950: '#030303',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Geist Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 12px -2px rgba(34, 197, 94, 0.15)',
        'glow-md': '0 0 24px -4px rgba(34, 197, 94, 0.2)',
      }
    },
  },
  plugins: [],
}
