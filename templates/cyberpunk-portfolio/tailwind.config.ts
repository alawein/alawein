import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0a0a0f",
          darker: "#050508",
          neon: "#00ff9f",
          pink: "#ff00ff",
          blue: "#00d4ff",
          yellow: "#ffff00",
          orange: "#ff6600",
          red: "#ff0040",
          purple: "#9d00ff",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00ff9f",
          foreground: "#0a0a0f",
        },
        muted: {
          DEFAULT: "#1a1a2e",
          foreground: "#6b7280",
        },
      },
      fontFamily: {
        cyber: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
      },
      animation: {
        "glitch": "glitch 1s linear infinite",
        "scan": "scan 2s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "cyber-float": "cyber-float 6s ease-in-out infinite",
        "typing": "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px #00ff9f, 0 0 10px #00ff9f, 0 0 20px #00ff9f" },
          "50%": { boxShadow: "0 0 10px #00ff9f, 0 0 20px #00ff9f, 0 0 40px #00ff9f" },
        },
        "cyber-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        typing: {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#00ff9f" },
        },
      },
      backgroundImage: {
        "cyber-grid": `
          linear-gradient(rgba(0, 255, 159, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 159, 0.03) 1px, transparent 1px)
        `,
        "cyber-gradient": "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
      },
      backgroundSize: {
        "cyber-grid": "50px 50px",
      },
    },
  },
  plugins: [],
} satisfies Config;

