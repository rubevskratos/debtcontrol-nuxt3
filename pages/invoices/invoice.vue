<template>
  <v-row justify="center" align="start">
    <!-- Detalles de factura-->
    <v-col cols="12" md="12">
      <v-card class="mt-5">
        <v-card-actions>
          <h3 class="pa-1">Detalles de factura:</h3>
          <v-spacer />
          <!-- Ver detalle de balance -->
          <invoice-balance-component :invoice="invoice" />
          <!-- Actualización de detalles de factura-->
          <update-invoice-details-component :invoices="[invoice]" @update-details="refreshInvoice()"/>
          <!-- Actualización de detalles de mantis -->
          <update-mantis-component :invoice="invoice" @update-mantis="refreshInvoice()" />
        </v-card-actions>
        <!-- Cuerpo de la página, detalles de factura -->
        <v-divider class="ma-5"></v-divider>
        <div class="d-flex justify-space-between pa-5">
          <div class="headline">
            <v-chip
              v-if="invoice.Active"
              class="ma-2"
              color="error"
              text-color="white"
              prepend-icon="mdi-close-circle"
            >
              Active
            </v-chip>
            <v-chip
              v-else
              class="ma-2"
              color="teal"
              text-color="white"
              prepend-icon="mdi-check-circle"
            >
              Closed
            </v-chip>
          </div>
          <div>
            <div class="headline">Número de factura:</div>
            <div>Cliente:</div>
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
            <div>Fecha de factura:</div>
            <div>Fecha de vencimiento:</div>
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
            <div>Balance:</div>
            <div>Días Vencida:</div>
          </div>
          <div>
            <div>
              {{ roundedBalance(invoice.Balance) }}
            </div>
            <div>
              {{ invoice.expired_days }}
            </div>
          </div>
          <div>
            <div>Estado:</div>
            <div>Notas:</div>
          </div>
          <div>
            <div>{{ invoice.last_action?.ActionName }}</div>
            <div>{{ invoice.InvoiceNotes }}</div>
          </div>
        </div>
        <!-- Datos de Centro, sólo visible si existe un centro asociado. -->
        <v-divider class="ma-5" v-if="invoice.Workplace"></v-divider>
        <v-card-text v-if="invoice.Workplace">
          Centro asociado:{{ invoice.Workplace }}
        </v-card-text>
      </v-card>
    </v-col>
    <!-- Sección datos Mantis -->
    <v-col cols="12" md="12" justify="center" v-if="invoice.employee_mantis">
      <v-card color="indigo-lighten-4">
        <div class="d-flex justify-space-between pa-5">
          <div>
            <div>
              Usuario Mantis: {{ invoice.employee_mantis?.EmployeeName }}
            </div>
            <div>
              Motivo Incidencia: {{ invoice.incidence_cause?.IncidenceName }}
            </div>
          </div>
          <div>
            <div>
              Asignación Mantis CS:
              {{ invoice.employee_bug_mantis?.EmployeeName }}
            </div>
            <div>Fecha Incidencia: {{ invoice.IncidenceDate }}</div>
          </div>
          <div>
            <div>Comentario Finanzas: {{ invoice.FinanceFollowUpPayment }}</div>
            <div>Comentario CS: {{ invoice.CSFollowUpPayment }}</div>
          </div>
        </div>
      </v-card>
    </v-col>
    <!-- Histórico de acciones -->
    <v-col cols="12" md="12" justify="center">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <new-action-component :invoices="[invoice]" :customer="customer" @new-followup="refreshFollowups"/>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-text>
          <v-table>
            <thead>
              <th>Fecha:</th>
              <th>Contacto:</th>
              <th>Acción:</th>
              <th>Motivo:</th>
              <th>Resultado:</th>
              <th>Próxima cita:</th>
            </thead>
            <tbody>
              <tr v-for="followup in followups" :key="followup.FollowUpId">
                <td>{{ followup.Date }}</td>
                <td>{{ followup.customer_contact?.ContactName }}</td>
                <td>{{ followup.action.ActionName }}</td>
                <td>{{ followup.Motive }}</td>
                <td>{{ followup.Result }}</td>
                <td>{{ followup.NextAppointmentDate }}</td>
                <td>
                  <update-action-component :followup="followup" :customer="customer" @update-followup="refreshFollowups"/>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
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
import { useInvoiceStore } from "@/store/invoices";
import { useAuthStore } from "@/store/auth";
import { useCustomerStore } from "@/store/customers";

export default {
  data() {
    return {
      invoice: useInvoiceStore().$state.invoice,
      followups: reactive([]),
      customer: useCustomerStore().$state.customer
    };
  },
  beforeMount: async function() {
    const customerStore = useCustomerStore()
    const invoiceStore = useInvoiceStore()
    try {
      let invoice = invoiceStore.$state.invoice
      await customerStore.fetchCustomer(invoice.customer.CustomerId)
      await invoiceStore.fetchInvoiceBalance(invoice.InvoiceId)
    } catch (error) {
      console.log(error)
    }
  },
  mounted: async function () {
    const auth = useAuthStore();
    const options = auth.defineOptions('GET')

    try {
      this.followups = await $fetch(
        `/api/followup/${this.invoice.InvoiceId}`,
        options
      );      
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    roundedBalance: (balance) => Math.round((balance + Number.EPSILON) * 100) / 100,
    async refreshFollowups() {
      const auth = useAuthStore();
      const invoiceStore = useInvoiceStore();
      const options = auth.defineOptions('GET');

      try {
        this.followups = await $fetch(
        `/api/followup/${this.invoice.InvoiceId}`,
        options
      );
      } catch (error) {
        console.log(error)
      }
    },
    async refreshInvoice() {
      const invoiceStore = useInvoiceStore;
      try {
        await useInvoiceStore().fetchInvoice(this.invoice.InvoiceId)
        this.invoice = useInvoiceStore().$state.invoice
      } catch (error) {
        console.log(error)
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
