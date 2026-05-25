/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc',
          400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf',
          800: '#86198f', 900: '#701a75',
        },
        gold: {
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706',
        },
      },
      backgroundImage: {
        'cinema': "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        'card-shine': "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)",
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        glow: { '0%': { boxShadow: '0 0 5px #c026d3, 0 0 10px #c026d3' }, '100%': { boxShadow: '0 0 20px #c026d3, 0 0 40px #c026d3, 0 0 60px #c026d3' } },
      },
      boxShadow: {
        'neon': '0 0 20px rgba(192, 38, 211, 0.5)',
        'neon-gold': '0 0 20px rgba(251, 191, 36, 0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
