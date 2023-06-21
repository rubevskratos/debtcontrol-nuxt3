// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from "vite-plugin-vuetify";
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  alias: {
    assets: "/<rootDir>/assets",
  },
  css: ["vuetify/styles/main.sass", "@mdi/font/css/materialdesignicons.min.css"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    ssr: {
      noExternal: ["vuetify"],
    },
  },
  components: [
    { path: '~/components/customers', extensions: ['vue'] },
    { path: '~/components/contacts', extensions: ['vue'] },
    { path: '~/components/followups', extensions: ['vue'] },
    { path: '~/components/payplan', extensions: ['vue'] },
    { path: '~/components/invoices', extensions: ['vue'] },
    { path: '~/components/main', extensions: ['vue'] },
    { path: '~/components/apexcharts', extensions: ['vue'] }
  ],
  modules: [
    "@pinia/nuxt",
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        {
          if (config.plugins) {
            let vuetifyPlugin = vuetify()
            config.plugins.push(vuetifyPlugin)
          }
        }
      );
    },
  ],
});
