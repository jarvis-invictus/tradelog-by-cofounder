import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        anchor: '#121F29',
        sage: '#A7C5B0',
        lavender: '#C9B4F2',
        sand: '#FFD9A6',
        mint: '#E6F5EE',
        neutral: '#F3F5F4',
        paper: '#FBFBF9',
        'ink-muted': '#5A6B73',
        rule: '#E3E6E4',
        'pnl-up': '#6FA77E',
        'pnl-down': '#C2585A',
        danger: '#C2585A',
        'danger-surface': '#F6DDDE',
        warning: '#E3A867',
        'warning-surface': '#FFEFD6',
        success: '#6FA77E',
        'success-surface': '#E6F5EE',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        pill: '999px',
        card: '14px',
        control: '10px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(18,31,41,0.04), 0 1px 2px rgba(18,31,41,0.05)',
        raised: '0 8px 24px -12px rgba(18,31,41,0.18)',
        'focus-ring': '0 0 0 3px rgba(201,180,242,0.45)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '280ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0.6, 0.2, 1)',
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
