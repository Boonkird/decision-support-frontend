/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050511', // ดำน้ำเงินลึก
          primary: '#00f3ff', // ฟ้า Neon
          secondary: '#bc13fe', // ม่วง Neon
          accent: '#fcee0a', // เหลือง Cyberpunk
          glass: 'rgba(255, 255, 255, 0.05)',
        },
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
