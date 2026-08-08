/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#EAB308",         // Warm Book Yellow/Gold
          "primary-content": "#1E1B18", // Dark contrast text on yellow
          "secondary": "#2A241E",       // Deep Brownish Black (Navbar/Header background)
          "secondary-content": "#FFFFFF",
          "accent": "#FACC15",          // Highlight Gold
          "neutral": "#1C1917",          // Deep Charcoal
          "base-100": "#FAFAFA",        // Clean White Body Background
          "base-200": "#F5F5F4",        // Off-white Cards/Sections
          "base-300": "#E7E5E4",        // Borders and Dividers
        },
        dark: {
          "primary": "#FACC15",         // Bright Gold for Dark Mode
          "primary-content": "#1C1917",
          "secondary": "#1C1917",       // Extra Dark Charcoal
          "secondary-content": "#F5F5F4",
          "accent": "#EAB308",
          "neutral": "#0C0A09",
          "base-100": "#12100E",        // Deep Espresso Dark Background
          "base-200": "#1C1917",        // Dark Cards
          "base-300": "#292524",        // Dark Borders
        },
      },
    ],
  },
};