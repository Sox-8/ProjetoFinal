let tailwindPlugin;
try {
  // Prefer the official PostCSS adapter for Tailwind if installed
  tailwindPlugin = require('@tailwindcss/postcss');
} catch (e) {
  // Fallback to the regular tailwindcss plugin
  tailwindPlugin = require('tailwindcss');
}

module.exports = {
  plugins: [
    tailwindPlugin(),
    require('autoprefixer')(),
  ],
};
