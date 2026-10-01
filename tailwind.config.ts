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
        bg: '#EEF3E8',
        card: '#FFFFFF',
        line: '#D9E4D0',
        track: '#E1EBD9',
        ink: '#1F2D1F',
        muted: '#566656',
        primary: {
          DEFAULT: '#2F5D3A',
          hover: '#254B2E',
          light: '#EAF3EB',
        },
        clay: '#C8754A',
        status: {
          weak: {
            text: '#C2412D',
            bg: '#FBE5E0',
          },
          medium: {
            text: '#B7791F',
            bg: '#FBEFD2',
          },
          solid: {
            text: '#2E8B57',
            bg: '#DDF1E5',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
        btn: '16px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(31, 45, 31, 0.06)',
        card: '0 1px 2px rgba(31, 45, 31, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
