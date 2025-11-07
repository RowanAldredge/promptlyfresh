/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))", // main
          700: "hsl(var(--brand-700))", // hover
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        surface: "hsl(var(--surface))",
        background: "hsl(var(--background))",
        text: {
          primary: "hsl(var(--text-primary))",
          muted: "hsl(var(--text-muted))",
        },
        borderc: "hsl(var(--borderc))",
        accent: "hsl(var(--accent))",
      },
    },
  },
  plugins: [],
};
