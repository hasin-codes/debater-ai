/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#010101",
        text: "#fefefe",
        primary: "#c7ff1b",
        "primary-hover": "#a6d916",
        secondary: "#181a1b",
        "secondary-hover": "#2a2d2e",
        "user-message": "#d3e0d3",
        "ai-message": "#c7ff1b",
        "input-shadow": "#c7ff1b",
        border: "#2a2d2e",
        foreground: "#fefefe",
      },
    },
  },
  plugins: [],
};
