/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef6ff",
          100: "#d9eaff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#59a6ff",
          500: "#2f84f7",
          600: "#1a66ed",
          700: "#1551d6",
          800: "#1843ad",
          900: "#1a3c89",
        },
        accent: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card:    "0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.04)",
        "card-md": "0 4px 12px -2px rgba(0,0,0,.08), 0 2px 4px -2px rgba(0,0,0,.04)",
        "card-lg": "0 12px 28px -4px rgba(0,0,0,.10), 0 4px 8px -4px rgba(0,0,0,.06)",
        brand:   "0 0 0 3px rgba(26,102,237,.15)",
        accent:  "0 0 0 3px rgba(249,115,22,.20)",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #1a66ed 0%, #2f84f7 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #020617 0%, #0f172a 60%, #1a3c89 100%)",
        "gradient-accent":
          "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
      },
      keyframes: {
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: ".4" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "fade-in":    "fade-in 0.3s ease-out both",
        shimmer:      "shimmer 1.8s linear infinite",
        "pulse-dot":  "pulse-dot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
