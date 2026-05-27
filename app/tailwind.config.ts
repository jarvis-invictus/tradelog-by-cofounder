import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        anchor: '#121F29', sage: '#A7C5B0', lavender: '#C9B4F2',
        sand: '#FFD9A6', mint: '#E6F5EE', neutral: '#F3F5F4',
        paper: '#FBFBF9', 'ink-muted': '#5A6B73', rule: '#E3E6E4',
        background: '#FBFBF9', surface: '#FFFFFF',
        'surface-muted': '#F3F5F4', 'surface-inset': '#E6F5EE',
        foreground: '#121F29', 'foreground-muted': '#5A6B73',
        border: '#E3E6E4', 'border-strong': '#121F29',
        primary: '#121F29', 'primary-fg': '#FBFBF9',
        accent: '#C9B4F2', 'accent-fg': '#121F29',
        success: '#6FA77E', 'success-surface': '#E6F5EE',
        warning: '#E3A867', 'warning-surface': '#FFEFD6',
        danger: '#C2585A', 'danger-surface': '#F6DDDE',
        'pnl-up': '#6FA77E', 'pnl-down': '#C2585A',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px', sm: '4px', md: '8px', lg: '12px',
        xl: '16px', '2xl': '24px', full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
