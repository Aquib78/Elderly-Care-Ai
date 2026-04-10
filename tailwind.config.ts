// tailwind.config.js  (or tailwind.config.ts)
// Wire up all the custom CSS variables so Tailwind knows about them.
// No changes needed elsewhere — just drop this in and the utility
// classes like bg-primary, text-emergency, shadow-soft all work.

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Elder-friendly: floor at 16px, generous scale
        xs:   ['0.875rem', { lineHeight: '1.5' }],
        sm:   ['1rem',     { lineHeight: '1.6' }],
        base: ['1.125rem', { lineHeight: '1.75' }],
        lg:   ['1.25rem',  { lineHeight: '1.7'  }],
        xl:   ['1.5rem',   { lineHeight: '1.5'  }],
        '2xl':['1.875rem', { lineHeight: '1.3'  }],
        '3xl':['2.25rem',  { lineHeight: '1.2'  }],
        '4xl':['2.75rem',  { lineHeight: '1.15' }],
      },
      colors: {
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light:      'hsl(var(--primary-light))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // ── Semantic tokens (use with bg-emergency, text-emergency etc.) ──
        emergency: {
          DEFAULT:    'hsl(var(--emergency))',
          foreground: 'hsl(var(--emergency-foreground))',
        },
        success: {
          DEFAULT:    'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        info: {
          DEFAULT:    'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        warning: {
          DEFAULT:    'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        sidebar: {
          DEFAULT:    'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary:    'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent:     'hsl(var(--sidebar-accent))',
          'accent-foreground':  'hsl(var(--sidebar-accent-foreground))',
          border:     'hsl(var(--sidebar-border))',
          ring:       'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 0.25rem)',
        sm:   'calc(var(--radius) - 0.5rem)',
        xl:   'calc(var(--radius) + 0.25rem)',
        '2xl':'calc(var(--radius) + 0.5rem)',
      },
      boxShadow: {
        // Now bg-shadow-soft and shadow-raised work via CSS variable
        soft:   'var(--shadow-soft)',
        raised: 'var(--shadow-raised)',
      },
      spacing: {
        // Touch-safe minimum sizes
        'touch': '48px',
        'touch-lg': '52px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}