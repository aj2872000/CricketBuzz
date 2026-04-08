/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        heading: ['"Barlow Condensed"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        // Static brand colours (always the same)
        'ipl-orange': '#FF6B00',
        'ipl-gold':   '#F4C430',
        // Theme-aware via CSS vars — use as bg-theme, text-theme, etc.
        theme: {
          bg:     'var(--bg)',
          card:   'var(--bg-card)',
          input:  'var(--bg-input)',
          border: 'var(--border)',
          text:   'var(--text)',
          muted:  'var(--text-muted)',
          sub:    'var(--text-sub)',
          accent: 'var(--orange)',
        },
      },
      borderColor: {
        theme: 'var(--border)',
      },
      backgroundColor: {
        theme: {
          DEFAULT: 'var(--bg)',
          card:    'var(--bg-card)',
          input:   'var(--bg-input)',
        },
      },
      textColor: {
        theme: {
          DEFAULT: 'var(--text)',
          muted:   'var(--text-muted)',
          sub:     'var(--text-sub)',
          accent:  'var(--orange)',
        },
      },
    },
  },
  plugins: [],
};
