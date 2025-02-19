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
  plugins: [
    { src: "~/plugins/firebase.js", mode: "client" },
    "~/plugins/axios.js",
    "~/plugins/ant-design-vue.js",
  ],

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
    baseURL: process.env.BASE_URL, // Base URL for API requests
    credentials: false, // Include credentials with requests if needed
    // Additional configurations can be added here
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: "idToken",
          global: true,
          required: true,
          type: "Bearer",
          storage: "localStorage",
        },
        endpoints: {
          login: {
            url:
              "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
              process.env.FIREBASE_API_KEY,
            method: "post",
            propertyName: "idToken",
          },
          logout: false,
          user: false,
        },
      },
    },
    localStorage: {
      prefix: "auth.",
    },
    redirect: {
      login: "/login",
      logout: "/login",
      home: "/",
    },
  },

  env: {
    tinyMCEKey: process.env.TINYMCE_KEY,
    baseURL: process.env.BASE_URL,
    urlImage: process.env.URL_IMAGE,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  },
};
