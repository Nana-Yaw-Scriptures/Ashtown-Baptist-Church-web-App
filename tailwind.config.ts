import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Morning-light church palette — deliberately not the cream/terracotta default
        paper: "#FBFAF7",     // page background, warm paper white
        ink: "#1C2434",       // primary text, deep slate (not tinted black)
        dusk: {
          50: "#EEF1F8",
          100: "#DCE2F0",
          500: "#3A5488",     // primary brand blue
          600: "#2E4272",
          700: "#233458",
        },
        amber: {
          400: "#bc3050",     // warm accent — candlelight / dawn
          500: "#c72f41",
        },
        mist: "#E7E3DA",      // hairlines and quiet borders
        sage: "#5B7169",      // secondary supporting tone
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
