import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: '#2F9BEA',
        deep: '#1B6FC2',
        tint: '#E6F3FE',
        ink: '#1F2A37',
        slate: '#4B5B70',
        mist: '#EAF4FE',
        line: '#D5E3F1',
        status: {
          weak: {
            text: '#B42318',
            bg: '#FEE4E2',
          },
          medium: {
            text: '#93370D',
            bg: '#FEF0C7',
          },
          solid: {
            text: '#166534',
            bg: '#DCFCE7',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-bricolage)', 'sans-serif'],
        'serif-display': ['var(--font-bricolage)', 'sans-serif'],
        display: ['var(--font-bricolage)', 'sans-serif'],
        sans: ['var(--font-figtree)', 'sans-serif'],
        body: ['var(--font-figtree)', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 10px 34px rgba(27, 111, 194, 0.14)',
        'glass-hover': '0 14px 40px rgba(27, 111, 194, 0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
