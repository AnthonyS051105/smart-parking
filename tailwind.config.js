/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
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
      },
      fontFamily: {
        // ✅ Tambahkan font family mapping untuk NativeWind
        thin: ["Poppins-Thin"],
        light: ["Poppins-Light"],
        normal: ["Poppins-Regular"],
        medium: ["Poppins-Medium"],
        semibold: ["Poppins-SemiBold"],
        bold: ["Poppins-Bold"],
        extrabold: ["Poppins-ExtraBold"],
        black: ["Poppins-Black"],
      },
      spacing: {
        // ✅ Tambahkan spacing khusus jika diperlukan
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
};
