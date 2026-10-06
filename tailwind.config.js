/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        clay: {
          yellow: "#FFE76A",
          pink: "#FFAAA6",
          blue: "#A8D8EA",
          purple: "#D3C0F9",
          mint: "#B5EAD7",
          orange: "#FFC6A5",
        },
        neo: {
          dark: "#1A1A1A",
          yellow: "#FFDE00",
          pink: "#FF3366",
          blue: "#3366FF",
          green: "#00CC66",
          purple: "#8B5CF6",
          bg: "#FFFBEB",
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-white': '4px 4px 0px 0px #FFFFFF',
        'clay-btn': 'inset -4px -4px 8px rgba(0,0,0,0.15), inset 4px 4px 8px rgba(255,255,255,0.7), 4px 4px 0px #000000',
        'clay-card': 'inset -6px -6px 12px rgba(0,0,0,0.08), inset 6px 6px 12px rgba(255,255,255,0.9), 6px 6px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};
