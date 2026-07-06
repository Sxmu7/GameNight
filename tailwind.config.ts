import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B10",
        surface: "#15151D",
        surface2: "#1D1D28",
        line: "#2A2A38",
        accent: "#FF4D6D",
        accent2: "#7C5CFF",
        good: "#3ECF8E",
        muted: "#8A8A9A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        floatUp: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
        floatUp: "floatUp 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
