/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lato', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',       // 10px — cards, containers
        md: '5px',                 // buttons, inputs
        sm: '3px',
        full: '9999px',            // pills, badges
      },
      colors: {
        // Sojern semantic tokens
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card:        { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover:     { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary:     { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary:   { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted:       { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent:      { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        // Sojern raw palette — useful for one-off overrides
        fire:   { DEFAULT: '#E35F3E', hover: '#B64C32', active: '#883925', light: '#F9DFD8' },
        navy:   { DEFAULT: '#242452', hover: '#647D94', active: '#17212F', mid: '#506476' },
        blue:   { DEFAULT: '#1362F7', hover: '#0D53D6' },
        // Status chip backgrounds
        status: {
          warning:  '#FEF7E3',
          success:  '#E2F9F1',
          error:    '#F9DFD8',
          info:     '#CBE8FF',
          neutral:  '#E0E5EA',
        },
        chart: {
          '1': 'hsl(var(--chart-1,14 72% 57%))',
          '2': 'hsl(var(--chart-2,240 39% 23%))',
          '3': 'hsl(var(--chart-3,207 19% 49%))',
          '4': 'hsl(var(--chart-4,160 30% 45%))',
          '5': 'hsl(var(--chart-5,280 30% 55%))',
        },
        sidebar: {
          DEFAULT:            'hsl(var(--sidebar-background))',
          foreground:         'hsl(var(--sidebar-foreground))',
          primary:            'hsl(var(--sidebar-primary))',
          'primary-foreground':'hsl(var(--sidebar-primary-foreground))',
          accent:             'hsl(var(--sidebar-accent))',
          'accent-foreground':'hsl(var(--sidebar-accent-foreground))',
          border:             'hsl(var(--sidebar-border))',
          ring:               'hsl(var(--sidebar-ring))',
        },
      },
      boxShadow: {
        'sojern-light': '3px 3px 20px 0px rgba(0,0,0,0.15)',
        'sojern-dark':  '0px 0px 20px 4px rgba(0,0,0,0.15)',
        'sojern-hover': '5px 5px 20px 0px rgba(0,0,0,0.30)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
