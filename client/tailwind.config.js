
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // THIS LINE IS CRUCIAL
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Design tokens - Chef BonBon Redesign
        cream: '#FAF7F2',
        olive: {
          DEFAULT: '#3B4A2F',
          dark: '#2E3D24',
        },
        gold: {
          DEFAULT: '#F5C842',
          dark: '#E2B830',
        },
        warm: '#F0EBE0',
        rust: '#D85A30',
        // Legacy colors (phasing out)
        'chef-primary': '#D17557',
        'chef-dark': '#141413',
        'chef-light-bg': '#F0EFEB',
      },
      maxWidth: {
        'mobile': '390px',
      },
    },
  },
  plugins: [],
}