<template>
  <v-row cols="12">
    <apexchart
      type="radialBar"
      height="250"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps({
  progress: Number,
  label: String,
});
</script>
<script lang="ts">
import { ref } from "vue";

export default {
  data() {
    const series = ref([this.progress ? this.progress : 0]);
    const chartOptions = ref({
      chart: {
        height: 250,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%",
          },
        },
      },
      labels: [this.label],
    });

    return {
      series,
      chartOptions,
    };
  },
};
</script>
