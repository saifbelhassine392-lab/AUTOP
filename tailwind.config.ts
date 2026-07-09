import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        autop: {
          red: '#dc2626',
          dark: '#1f2937',
          light: '#f3f4f6',
        }
      },
    },
  },
  plugins: [],
}
export default config