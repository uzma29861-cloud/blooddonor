/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: 'var(--surface-bg)',
          card: 'var(--surface-card)',
          border: 'var(--surface-border)',
        },
        content: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
        },
        emergency: {
          50: 'var(--emergency-50)',
          100: 'var(--emergency-100)',
          200: 'var(--emergency-200)',
          300: 'var(--emergency-300)',
          400: 'var(--emergency-400)',
          500: 'var(--emergency-500)',
          600: 'var(--emergency-600)',
          700: 'var(--emergency-700)',
          800: 'var(--emergency-800)',
          900: 'var(--emergency-900)',
          950: 'var(--emergency-950)',
        },
        healthcare: {
          teal: '#0d9488',
          emerald: '#059669',
          slate: '#1e293b',
          bg: '#f8fafc',
          border: '#e2e8f0',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-subtle': 'bounce 1.5s infinite',
      }
    },
  },
  plugins: [],
}
