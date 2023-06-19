<template>
  <v-row class="flex fill-height ma-5" justify="center" align="center">
    <v-col cols="12" sm="8" md="8 ">
      <v-card justify="center">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{ greeting() }}!</h3>
            <div>Estás en la página principal, ¿Qué hacemos hoy?</div>
          </div>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>
<script>
export default {
  data() {
    return {
      greetings: "",
    };
  },
  methods: {
    greeting() {
      var today = new Date();
      var curHr = today.getHours();

      if (curHr < 12) {
        return (this.greetings = "Buenos días");
      } else if (curHr < 18) {
        return (this.greetings = "Buenas tardes");
      } else {
        return (this.greetings = "Buenas noches");
      }
    },
  },
};
</script>
