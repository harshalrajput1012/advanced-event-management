export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        display: ["Playfair Display", "ui-serif", "Georgia"]
      },
      colors: {
        ink: "#0f172a",
        coral: "#ff6b6b",
        mint: "#13c6a3",
        amber: "#f59e0b",
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af"
        },
        orange: {
          100: "#fed7aa",
          500: "#f97316",
          600: "#ea580c"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16,24,40,0.12)",
        card: "0 4px 24px rgba(0,0,0,0.06)",
        glow: "0 0 0 1px rgba(59,130,246,0.1), 0 4px 24px rgba(59,130,246,0.15)"
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
