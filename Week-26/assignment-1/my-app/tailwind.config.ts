import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          'ethereum-gradient': 'radial-gradient(66.32% 66.32% at 54.13% 113.95%, rgba(108, 38, 255, .2) 0, rgba(242, 89, 255, 0) 100%), linear-gradient(211.99deg, rgba(65, 157, 241, .2) -4.17%, rgba(45, 143, 234, 0) 68.7%), radial-gradient(100% 100% at 28.65% 0, #d5bdf5 0, rgba(250, 247, 254, 0) 100%), linear-gradient(135deg, #16f195, rgb(171, 102, 255))'

      },
    },
  },
  plugins: [],
};
export default config;
