import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "influenca-blue": "#003CFF",
        "influenca-gold": "#D4AF37",
        "influenca-light-gray": "#FAFAFA",
        "influenca-gray": "rgba(8, 7, 5, 0.5)",
        "influenca-dark-brown": "#181610",
        "influenca-black": "#080705",
        "influenca-black-30": "rgba(8, 7, 5, 0.3)",
        "influenca-black-70": "rgba(8, 7, 5, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
