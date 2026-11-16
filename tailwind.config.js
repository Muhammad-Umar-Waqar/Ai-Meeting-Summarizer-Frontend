/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        meet: {
          blue: '#1a73e8',
          'blue-hover': '#1765cc',
          'blue-soft': '#e8f0fe',
          'blue-text': '#1967d2',
          green: '#188038',
          'green-btn': '#1e8e3e',
          red: '#ea4335',
          'red-dark': '#c5221f',
          surface: '#ffffff',
          'surface-alt': '#f8f9fa',
          border: '#dadce0',
          text: '#202124',
          'text-secondary': '#3c4043',
          'text-muted': '#5f6368',
          dark: '#202124',
          'dark-elevated': '#3c4043',
          'dark-hover': '#5f6368',
          'dark-tile': '#3c4043',
          'dark-bar': '#202124',
          'icon-light': '#e8eaed',
        },
      },
      fontFamily: {
        sans: [
          'Roboto',
          'Google Sans',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        meet: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        'meet-lg':
          '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
      },
      borderRadius: {
        tile: '12px',
        control: '24px',
      },
    },
  },
  plugins: [],
};
