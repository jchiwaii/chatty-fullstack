import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F1E8B8",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false,
  },
};
