import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        background: 'oklch(99% .005 240)',
        foreground: 'oklch(18% .03 250)',
        primary: {
          DEFAULT: 'oklch(46% .18 265)',
          foreground: 'oklch(99% 0 0)',
          glow: 'oklch(62% .2 270)',
        },
        secondary: {
          DEFAULT: 'oklch(96% .012 250)',
          foreground: 'oklch(25% .04 260)',
        },
        muted: {
          DEFAULT: 'oklch(96% .008 250)',
          foreground: 'oklch(50% .025 255)',
        },
        accent: {
          DEFAULT: 'oklch(95% .04 200)',
          foreground: 'oklch(25% .06 235)',
        },
        success: {
          DEFAULT: 'oklch(65% .16 155)',
          foreground: 'oklch(99% 0 0)',
        },
        warning: {
          DEFAULT: 'oklch(78% .14 75)',
          foreground: 'oklch(25% .05 60)',
        },
        destructive: {
          DEFAULT: 'oklch(60% .22 25)',
          foreground: 'oklch(99% 0 0)',
        },
        border: 'oklch(92% .01 250)',
        input: 'oklch(94% .01 250)',
        ring: 'oklch(46% .18 265)',
        card: {
          DEFAULT: 'oklch(100% 0 0)',
          foreground: 'oklch(18% .03 250)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'float-icon': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(20px, -30px) rotate(5deg)' },
          '50%': { transform: 'translate(-15px, -50px) rotate(-5deg)' },
          '75%': { transform: 'translate(25px, -20px) rotate(3deg)' },
        },
      },
      animation: {
        'float-icon': 'float-icon 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
