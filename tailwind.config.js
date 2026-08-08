/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EAB308",
        secondary: "#2A241E",
        accent: "#FACC15",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#EAB308",
          "primary-content": "#1E1B18",
          "secondary": "#2A241E",
          "secondary-content": "#FFFFFF",
          "accent": "#FACC15",
          "neutral": "#1C1917",
          "base-100": "#FAFAFA",
          "base-200": "#F5F5F4",
          "base-300": "#E7E5E4",
        },
        dark: {
          "primary": "#FACC15",
          "primary-content": "#1C1917",
          "secondary": "#1C1917",
          "secondary-content": "#F5F5F4",
          "accent": "#EAB308",
          "neutral": "#0C0A09",
          "base-100": "#12100E",
          "base-200": "#1C1917",
          "base-300": "#292524",
        },
      },
    ],
  },
};