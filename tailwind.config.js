/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom colors for Blood Donation theme
        primary: "#E31837", // Blood Red
        secondary: "#8B0000", // Dark Red
        accent: "#FF6B6B", // Light Red
        neutral: "#2D3748", // Dark Gray
        "base-100": "#FFFFFF", // White
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bloodDonation: {
          primary: "#E31837",
          secondary: "#8B0000",
          accent: "#FF6B6B",
          neutral: "#2D3748",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
      "light",
      "dark",
    ],
  },
};
