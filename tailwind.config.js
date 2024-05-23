/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#4D4D4D',
        primary: '#B7EC5D',
        'primary-dark': '#648D1E',
        'primary-frame': 'rgba(183, 236, 93, 0.3)',
        'primary-linear': 'rgb(183, 236, 93)',
        secondary: '#4D4D4D',
        'secondary-dark': '#222222',
        'secondary-tint': '#f5f5f5',
        success: '#B7EC5D',
        'success-dark': '#648D1E',
        'success-tint': '#D9FF99',
        danger: '#F93819',
        'danger-dark': '#A01600',
        'danger-tint': '#FFA394',
        'pen-black': '#000000',
        'pen-blue': '#0066FF',
        'pen-red': '#f93819',
      },
      backgroundImage: {
        'add-tint-icon': 'url("/src/assets/icon/ic_add_tint.svg")',
        'add-dark-icon': 'url("/src/assets/icon/ic_add_dark.svg")',
      },
    },
  },
  plugins: [],
}
