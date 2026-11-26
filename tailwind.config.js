/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      colors: {
        algora: {
          white: "#FFFFFF",
          soft: "#F8FAF7",
          green: "#176B43",
          emerald: "#35A66A",
          ink: "#171C19",
          muted: "#777F79",
          border: "#E4EAE5",
        },
      },
      transitionTimingFunction: {
        algora: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
