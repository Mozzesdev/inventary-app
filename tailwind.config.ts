import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "inter-medium": ['"Inter Medium"', "sans-serif"],
        "inter-bold": ['"Inter Bold"', "sans-serif"],
        "inter-extra-bold": ['"Inter Extra Bold"', "sans-serif"],
        "inter-thin": ['"Inter Thin"', "sans-serif"],
      },
      animation: {
        wiggle: "wiggle 3s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "scale(1)", opacity: ".8" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
