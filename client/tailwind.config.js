/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canopy: {
          forest: '#174D36',
          green: '#2F7D50',
          sage: '#6BAF82',
          mint: '#DCEFE2',
          canvas: '#F4F8F3',
          dark: '#123B2A'
        }
      },
      boxShadow: { soft: '0 8px 30px rgba(23, 77, 54, 0.06)' }
    }
  },
  plugins: []
};
