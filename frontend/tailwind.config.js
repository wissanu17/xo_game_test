/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'player-x': '#4ade80', // Green for X
        'player-o': '#60a5fa', // Blue for O
        'game-bg': '#121212', // Dark background
        'board-bg': 'rgba(255, 255, 255, 0.05)', // Board background
        'highlight': '#a855f7', // Purple highlight for ties
      },
      boxShadow: {
        'player-x': '0 0 15px #4ade80',
        'player-o': '0 0 15px #60a5fa',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      fontFamily: {
        'sans': ['Raleway', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
