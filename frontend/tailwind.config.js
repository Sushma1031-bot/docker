/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          900: "#0a0d12",
          800: "#11151c",
          700: "#161b24",
          600: "#1c2330",
          500: "#232c3b",
        },
        line: "#26303f",
        brand: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#b6d9ff",
          300: "#83bcff",
          400: "#4f97ff",
          500: "#2b76f5",
          600: "#1a59d6",
          700: "#1746ab",
          800: "#173c87",
          900: "#19366c",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "bounce-dot": "bounce-dot 1.4s infinite ease-in-out both",
      },
    },
  },
  plugins: [],
};
