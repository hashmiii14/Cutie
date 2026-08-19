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
        poki: {
          bg: "#4be0c4",
          bgDark: "#26c4a8",
          card: "#ffffff",
          text: "#1a2b3c",
          muted: "#64748b",
          accent: "#0072ff",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        poki: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        tile: "0 4px 12px rgba(0, 0, 0, 0.08)",
        tileHover: "0 14px 28px rgba(0, 0, 0, 0.18)",
      },
    },
  },
  plugins: [],
};
