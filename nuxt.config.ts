import NuxtConfiguration from "@nuxt/config";

const config: NuxtConfiguration = {
  mode: "spa",
  head: {
    title: "Staart UI",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Frontend admin UI for Staart"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  loading: { color: "#fff" },
  css: [],
  plugins: ["~/plugins/axios", "~/plugins/vue-notification", { src: "~/plugins/vuex-persist", ssr: false }],
  modules: ["@nuxtjs/axios", "@nuxtjs/pwa"],
  axios: {
    host: process.env.NODE_ENV === "production" ? "example.com" : "localhost",
    https: process.env.NODE_ENV === "production",
    port: 7007
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient && config && config.module) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
};

export default config;
