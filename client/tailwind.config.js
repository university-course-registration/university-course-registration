/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0b0f1a",
          700: "#2a2f3a",
        },
        accent: {
          500: "#2d6cdf",
          400: "#4b8bff",
          300: "#7fb2ff",
        },
        sun: {
          500: "#f59e0b",
          400: "#fbbf24",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.18)",
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
