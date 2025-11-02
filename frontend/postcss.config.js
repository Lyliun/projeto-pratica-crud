export default {
  plugins: {
    // Use the PostCSS wrapper package for Tailwind if available.
    // Some Tailwind distributions require the `@tailwindcss/postcss` wrapper
    // to be used as the PostCSS plugin name.
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};