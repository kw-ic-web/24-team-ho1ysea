/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeInOut: {
          "0%": { opacity: 0 },
          "10%": { opacity: 1 },
          "90%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 3s ease-in-out",
      },
      screens: {
        xs: "400px", // 400px 이하일 때 적용
      },
    },
  },
  plugins: [],
};
