import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-space-mono)'],
      },
      colors: {
        steel: {
          50: '#fafafc',
          100: '#f4f5f8',
          200: '#e6eaf0',
          300: '#d3d9e4',
          400: '#b9c3d4',
          500: '#a7b4c9',
          600: '#8792a3',
          700: '#616875',
          800: '#353a40',
          900: '#1c1f22',
          950: '#141618',
        },
      },
    },
  },
  plugins: [],
};

export default config;
