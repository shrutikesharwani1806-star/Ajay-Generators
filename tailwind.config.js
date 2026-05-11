/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#06101b",
        secondary: "#0c1b2a",
        accent: "#f59e0b", // Orange/Gold
        "accent-dark": "#d97706",
        card: "#112233",
        border: "rgba(255, 255, 255, 0.05)",
        "border-accent": "rgba(245, 158, 11, 0.2)",
        text: {
          primary: "#ffffff",
          secondary: "#cbd5e1",
          muted: "#94a3b8",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        inter: ["var(--font-inter)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
