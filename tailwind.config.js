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
        // Argentine flag inspired palette + dark mode base
        sky: {
          arg: "#74ACDF",
        },
        sun: {
          arg: "#F6B40E",
        },
        ink: {
          900: "#0A0E1A",
          800: "#111827",
          700: "#1F2937",
        },
        accent: {
          gold: "#F6B40E",
          green: "#10B981",
          red: "#EF4444",
        },
      },
      fontFamily: {
        display: ["system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
