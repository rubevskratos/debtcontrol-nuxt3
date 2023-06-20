<template>
  <v-card v-for="(commitment, i) in payplans" key="i">
    <v-card-title> Plan de Pagos </v-card-title>
    <v-card-text>
      <v-row cols="12">
        <v-col cols="6">
          Tipo de acuerdo: {{ commitment.AgreementType }}
        </v-col>
        <v-col cols="6">
          Fecha de inicio: {{ commitment.StartDate }}
        </v-col>
      </v-row>
      <v-row cols="12">
        <v-col cols="3">
          Importe total: {{ commitment.TotalAmount }}
        </v-col>
        <v-col cols="3">
          Importe pagado: {{ commitment.amount_paid }}
        </v-col>
        <v-col cols="3">
          # de pagos: {{ commitment.NumberPayments }}
        </v-col>
        <v-col cols="3">
          Intervalos en días: {{ commitment.IntervalDays }} días 
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  payplans: Object
})
</script>

<style lang="scss" scoped></style>
