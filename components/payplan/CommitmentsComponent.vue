<template>
  <v-card v-for="(commitment, i) in payplans" key="i">
    <v-card-title> Factura: {{  }} </v-card-title>
    <v-card-text>
      <v-row cols="12">
        <v-col cols="10">
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
        </v-col>
        <v-col cols="2">
          <InvCommitmentsComponent :payplanid="commitment.PayPlanId" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useInvoiceStore } from '~/store/invoices';
import InvCommitmentsComponent from './InvCommitmentsComponent.vue';

const props = defineProps({
  payplans: Object
})

const invoice = useInvoiceStore()
</script>

<style lang="scss" scoped></style>
