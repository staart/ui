module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [require("@tailwindcss/forms")],
  purge: {
    content: ["./src/**/*.svelte", "./public/**/*.html"],
    enabled: process.env.NODE_ENV !== "development",
  },
};
