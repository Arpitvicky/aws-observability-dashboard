import type { Config } from "tailwindcss";
export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // (optional catch-all)
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
