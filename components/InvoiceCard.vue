<template>
    <v-container>
      <v-card elevation="10" shaped>
        <v-card-title primary-title>
          {{ invoice.InvoiceNumber }} -
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
        </v-card-title>
        <v-card-subtitle>
            {{ invoice.customer.CustomerCode }} - {{ invoice.customer.CustomerName }}
        </v-card-subtitle>
        <v-card-text>
            <v-list-item>
              <v-row>
                <v-col>
                  Fecha Factura: {{ invoice.InvoiceDate }}
                </v-col>
                <v-col>
                  Fecha Vencimiento: {{ invoice.DueDate }}
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item>
              <v-row>
                <v-col>
                  Gestor Mantis: {{ invoice.employee_mantis }}
                </v-col>
                <v-col>
                  Notas de Factura: {{ invoice.InvoiceNotes }}
                </v-col>
              </v-row>
            </v-list-item>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            Balance: {{ invoice.Balance }} € ||
            Días vencida: {{  invoice.expired_days }}
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  
  export default {
    props: {
      invoice: {}
    },
  }
  </script>
  
  <style lang="scss" scoped></style>
  