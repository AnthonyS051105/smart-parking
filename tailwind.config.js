/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}", // opsional jika file App.js masih di root
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#B7F7FB", // Light green
          DEFAULT: "#DDF8FB", // Default green
          dark: "#5B9396", // Dark green
          text: "#CEF1F3",
        },
        secondary: {
          light: "#FBBF24", // Light yellow
          DEFAULT: "#F59E0B", // Default yellow
          dark: "#D97706", // Dark yellow
        },
      },
    },
  },
  plugins: [],
};
