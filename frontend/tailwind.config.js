/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Home page theme colors
        home: {
          bg: "#030012",
          text: "#f4f4f5",
          accent: "#f97316",
          accentDark: "#ea580c",
          accentLight: "#fdba74",
          cardBg: "rgba(15, 14, 28, 0.6)",
          border: "rgba(249, 115, 22, 0.15)",
        },
        // Tech theme colors (DSA, Full Stack)
        tech: {
          bg: "#030012",
          surface: "#0a0915",
          border: "rgba(124, 58, 237, 0.15)",
          accent: "#8b5cf6",
          accent2: "#06b6d4",
          accent3: "#f59e0b",
          text: "#f4f4f5",
          muted: "#9ca3af",
          card: "rgba(15, 14, 28, 0.6)",
        },
        // Aptitude theme colors
        apt: {
          bg: "#030012",
          text: "#f4f4f5",
          accent: "#10b981",
          accentLight: "#34d399",
          cardBg: "rgba(15, 14, 28, 0.6)",
          border: "rgba(16, 185, 129, 0.15)",
          muted: "#9ca3af",
          badge: "rgba(16, 185, 129, 0.1)",
          itemBg: "rgba(20, 20, 35, 0.5)",
          itemHover: "rgba(16, 185, 129, 0.08)",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        syne: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'drift': 'drift 12s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        drift: {
          from: { transform: 'translate(0, 0) scale(1)' },
          to: { transform: 'translate(30px, 20px) scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
