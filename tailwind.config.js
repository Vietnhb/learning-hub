/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        japanese: ["Noto Sans JP", "sans-serif"],
        "japanese-serif": ["Noto Serif JP", "serif"],
      },
      backgroundImage: {
        seigaiha:
          "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Cdefs%3E%3Cpattern id=%27seigaiha%27 x=%270%27 y=%270%27 width=%2740%27 height=%2740%27 patternUnits=%27userSpaceOnUse%27%3E%3Cpath fill=%27none%27 stroke=%27%23c1272d20%27 stroke-width=%271.5%27 d=%27M0 20 Q 10 10, 20 20 Q 30 30, 40 20 M-10 20 Q 0 10, 10 20 M20 20 Q 30 30, 40 20 Q 50 10, 60 20 M0 0 Q 10 10, 20 0 M20 0 Q 30 10, 40 0 M0 40 Q 10 30, 20 40 M20 40 Q 30 30, 40 40%27/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27url(%23seigaiha)%27/%3E%3C/svg%3E')",
        sakura:
          "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27%3E%3Cpath d=%27M30 5 L32 15 L42 13 L34 20 L40 28 L30 25 L20 28 L26 20 L18 13 L28 15 Z%27 fill=%27%23ff6b9d20%27/%3E%3C/svg%3E')",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Traditional Japanese Colors
        japan: {
          red: "#C1272D", // 紅色 (Beni-iro) - Traditional red
          gold: "#F39800", // 黄金色 (Koganeiro) - Golden
          green: "#227D51", // 緑色 (Midori-iro) - Green
          indigo: "#165E83", // 藍色 (Ai-iro) - Indigo
          sakura: "#FF6B9D", // 桜色 (Sakura-iro) - Cherry blossom
          cream: "#F8F4E6", // 生成り色 (Kinari-iro) - Cream
          charcoal: "#333333", // 墨色 (Sumi-iro) - Charcoal
        },
        // Existing colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
