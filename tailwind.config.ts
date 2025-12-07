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
        'shell-light': '#fafafa',
        'shell-dark': '#0a0a0f',
        
        // Text - always true black/white
        'text-primary': '#000000',
        'text-muted': '#666666',
        
        // Semantic colors (for meaningful data only)
        'status-live': '#22c55e',      // Green - live indicators
        'status-offline': '#ef4444',   // Red - offline/error
        'data-cyan': '#00d4ff',        // Data accent
        'data-amber': '#ffb700',       // Data accent
        'data-magenta': '#e6007e',     // Data accent (reserved)
        'data-green': '#00ff88',       // Data accent
        
        // Widget backgrounds
        'widget-light': '#ffffff',
        'widget-dark': '#141419',
        
        // Borders
        'border-light': '#e5e5e5',
        'border-dark': '#2a2a2e',
      },
      fontFamily: {
        // Primary sans - two cuts for different sizes
        'sans-display': ['"neue-haas-grotesk-display"', 'system-ui', 'sans-serif'],
        'sans-text': ['"neue-haas-grotesk-text"', 'system-ui', 'sans-serif'],
        // Default sans uses text cut (safer default)
        sans: ['"neue-haas-grotesk-text"', 'system-ui', 'sans-serif'],
        
        // Mono - for data, numbers, code
        mono: ['"input-mono"', 'var(--font-jetbrains-mono)', 'monospace'],
        
        // Serif - for long-form reading (KNOWLEDGE)
        serif: ['"linotype-sabon"', 'Georgia', 'serif'],
        
        // Display - for playful moments
        display: ['"sausage"', 'cursive'],
        
        // Book covers (KNOWLEDGE section)
        'trade-gothic': ['"trade-gothic-next"', 'sans-serif'],
        'trade-gothic-compressed': ['"trade-gothic-next-compressed"', 'sans-serif'],
      },
      fontWeight: {
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
      fontSize: {
        // Fixed sizes for UI elements (≤20px use text cut)
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.6' }],
        'lg': ['18px', { lineHeight: '1.6' }],
        'xl': ['20px', { lineHeight: '1.5' }],
        
        // Fluid sizes for display text (>20px, use display cut)
        // clamp(min, preferred, max)
        'nav': ['clamp(14px, 2.5vw + 8px, 40px)', { lineHeight: '1.3' }],
        '2xl': ['clamp(24px, 2vw + 16px, 28px)', { lineHeight: '1.3' }],
        '3xl': ['clamp(28px, 2.5vw + 16px, 36px)', { lineHeight: '1.2' }],
        '4xl': ['clamp(32px, 3vw + 16px, 44px)', { lineHeight: '1.1' }],
        '5xl': ['clamp(40px, 4vw + 16px, 56px)', { lineHeight: '1.1' }],
        '6xl': ['clamp(48px, 5vw + 16px, 72px)', { lineHeight: '1' }],
      },
      borderRadius: {
        'widget': '12px',
      },
    },
  },
  plugins: [],
}

export default config