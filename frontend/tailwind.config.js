/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px", // 400px 이하일 때 적용
      },
    },
  },
  plugins: [],
};
