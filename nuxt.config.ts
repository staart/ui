import NuxtConfiguration from "@nuxt/config";

const config: NuxtConfiguration = {
  mode: "universal",
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
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/balloon-css/0.5.0/balloon.min.css"
      }
    ],
    script: [
      {
        type: "text/javascript",
        src:
          "https://polyfill.io/v3/polyfill.min.js?features=es5%2Ces6%2Ces7%2CrequestIdleCallback%2CBlob%2CIntersectionObserver%2CHTMLPictureElement%2CIntersectionObserverEntry%2CMutationObserver%2Cfetch%2ClocalStorage%2CPromise%2CPromise.prototype.finally"
      },
      {
        type: "text/javascript",
        src: "https://public-cdn.oswaldlabs.com/focus-visible.js",
        async: true
      }
    ]
  },
  loading: { color: "#492257" },
  css: [],
  plugins: [
    "~/plugins/axios",
    { src: "~/plugins/vue-notification", ssr: false },
    "~/plugins/vue-timeago",
    { src: "~/plugins/vuex-persist", ssr: false }
  ],
  modules: ["@nuxtjs/axios", "@nuxtjs/pwa", "@nuxtjs/markdownit"],
  axios: {
    host:
      process.env.NODE_ENV === "production"
        ? "staart.caprover.o15y.com"
        : "localhost",
    https: process.env.NODE_ENV === "production",
    port: process.env.NODE_ENV === "production" ? 443 : 7007
  },
  scrollBehavior: function() {
    return { x: 0, y: 0 };
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
