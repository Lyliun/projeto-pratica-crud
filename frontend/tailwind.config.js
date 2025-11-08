/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  // Correct content paths: files under frontend root
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  // Use imported plugin (ESM) because package.json sets "type": "module"
  plugins: [
    tailwindcssAnimate,
  ],
};
