import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#02130f",
        ink: "#ecfff6",
        muted: "#a8c9bb",
        green: "#4dff9a",
        cyan: "#2de8d0",
        lime: "#c8ff5a",
        amber: "#ffb938",
        red: { DEFAULT: "#ff3355", deep: "#c4123a" },
        violet: "#8b5cff",
        magenta: "#ff3da6",
      },
      fontFamily: {
        display: ["var(--f-unbounded)", "Arial Black", "system-ui", "sans-serif"],
        body: ["var(--f-sora)", "system-ui", "sans-serif"],
        ar: ["var(--f-kufi)", "Segoe UI", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
