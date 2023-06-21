import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxt) => {
  if (nuxt.ssrContext) {
    return
  }

  import("vue3-apexcharts").then((module) => {
    const VueApexCharts = module.default;
    nuxt.vueApp.use(VueApexCharts);
  });
});
