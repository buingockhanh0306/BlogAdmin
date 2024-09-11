export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "FE",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/axios.js", "~/plugins/ant-design-vue.js"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    // Equivalent to { path: '~/components' }
    "~/components",
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxt/http", "@nuxtjs/auth"],

  css: ["~/assets/scss/main.scss"],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios"],

  axios: {
    // Example: setting baseURL
    baseURL: "http://localhost:8080/api", // Base URL for API requests
    credentials: false, // Include credentials with requests if needed
    // Additional configurations can be added here
  },

  auth: {
    strategies: {
      // Cấu hình phương thức xác thực
      local: {
        endpoints: {
          login: { url: "/login", method: "post", propertyName: "token" },
          logout: { url: "/logout", method: "post" },
          user: { url: "/me", method: "get", propertyName: "user" },
        },
        token: {
          property: "token",
          global: true,
        },
        user: {
          property: false,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
