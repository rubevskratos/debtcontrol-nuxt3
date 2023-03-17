<template>
  <v-row class="fill-height" justify="center">
    <v-col cols="12" md="12">
      <v-card class="mt-5">
        <div class="d-flex justify-space-between">
          <div class="headline">
            <v-chip v-if="invoice.Active"
            class="ma-2"
            color="error"
            text-color="white"
            prepend-icon="mdi-close-circle"
          >
          Active
          </v-chip>
          <v-chip v-else
            class="ma-2"
            color="teal"
            text-color="white"
            prepend-icon="mdi-check-circle"
          >
          Closed
          </v-chip>
          </div>
          <div>
            <div class="headline">
              Número de factura:
            </div>
            <div>
              Cliente:
            </div>
          </div>
          <div>
            <div>
              {{ invoice.InvoiceNumber }}
            </div>
            <div>
              {{ invoice.customer.CustomerCode }} -
              {{ invoice.customer.CustomerName }}
            </div>
          </div>
          <div>
            <div>Fecha de factura: </div>
            <div>Fecha de vencimiento: </div>
          </div>
          <div>
            <div>
              {{ invoice.InvoiceDate }}
            </div>
            <div>
              {{ invoice.DueDate }}
            </div>
          </div>
          <div>
            <div>
              Balance:
            </div>
            <div>
              Días Vencida:
            </div>
          </div>
          <div>
            <div>
              {{ roundedBalance(invoice.Balance) }}
            </div>
            <div>
              {{ invoice.expired_days }}
            </div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { useInvoiceStore } from "@/store/invoices";

export default {
  data() {
    return {
      invoice: useInvoiceStore().$state.invoice,
    };
  },
  methods: {
    roundedBalance: (balance) => Math.round((balance + Number.EPSILON) * 100) / 100
  }
};
</script>

<style lang="scss" scoped></style>
