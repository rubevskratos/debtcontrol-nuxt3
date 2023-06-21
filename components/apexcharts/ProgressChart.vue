<template>
  <client-only>
    <apexchart
      type="radialBar"
      height="100"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </client-only>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const series = ref([44, 55, 67, 83]);
    const chartOptions = ref({
      chart: {
        height: 100,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%",
          },
        },
      },
      labels: ["Team A", "Team B", "Team C", "Team D"],
    });

    return {
      series,
      chartOptions,
    };
  },
};
</script>
