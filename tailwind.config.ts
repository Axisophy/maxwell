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
        // Shell colors
        'shell-light': '#f5f5f5',
        'shell-dark': '#0a0a0f',
        
        // Text
        'text-primary': '#1a1a1a',
        'text-secondary': '#666666',
        'text-muted': '#999999',
        
        // Accent colors for data
        'accent-cyan': '#00d4ff',
        'accent-amber': '#ffb700',
        'accent-magenta': '#ff00aa',
        'accent-green': '#00ff88',
        
        // Widget backgrounds
        'widget-light': '#ffffff',
        'widget-dark': '#141419',
      },
      fontFamily: {
        sans: ['futura-100', 'futura-100-latin-extended', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
      borderRadius: {
        'widget': '12px',
      },
    },
  },
  plugins: [],
}

export default config
