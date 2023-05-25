<template>
  <v-row justify="center" align="start">
    <!-- Detalles de factura-->
    <v-col cols="12" md="12">
      <v-card class="mt-5">
        <v-card-actions>
          <h3 class="pa-1">Detalles de factura:</h3>
          <v-spacer />
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
    <!-- Balance de Factura -->
    <v-col cols="6" md="6" justify="center" align="start">
      <v-card>
        <v-card-text>
          <v-table>
            <thead>
              <th>Due Date</th>
              <th>Payment Method</th>
              <th>Not Due</th>
              <th>30 Days</th>
              <th>60 Days</th>
              <th>90 Days</th>
              <th>120 Days</th>
              <th>150 Days</th>
              <th>180 Days</th>
              <th>360 Days</th>
              <th>Older</th>
            </thead>
            <tbody>
              <tr v-for="item in active_balance" :key="item.ActiveBalanceId">
                <td>TBD</td>
                <td>TBD</td>
                <td>{{ roundedBalance(item.NotDue) }}</td>
                <td>{{ roundedBalance(item.Days30) }}</td>
                <td>{{ roundedBalance(item.Days60) }}</td>
                <td>{{ roundedBalance(item.Days90) }}</td>
                <td>{{ roundedBalance(item.Days120) }}</td>
                <td>{{ roundedBalance(item.Days150) }}</td>
                <td>{{ roundedBalance(item.Days180) }}</td>
                <td>{{ roundedBalance(item.Days360) }}</td>
                <td>{{ roundedBalance(item.Older) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- Histórico de acciones -->
    <v-col cols="6" md="6" justify="center">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <new-action-component :invoices="[invoice]" @new-followup="refreshFollowups"/>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-text>
          <v-table>
            <thead>
              <th>Fecha:</th>
              <th>Acción:</th>
              <th>Motivo:</th>
              <th>Resultado:</th>
              <th>Próxima cita:</th>
            </thead>
            <tbody>
              <tr v-for="followup in followups" :key="followup.FollowUpId">
                <td>{{ followup.Date }}</td>
                <td>{{ followup.action.ActionName }}</td>
                <td>{{ followup.Motive }}</td>
                <td>{{ followup.Result }}</td>
                <td>{{ followup.NextAppointmentDate }}</td>
                <td>
                  <update-action-component :followup="followup" @update-followup="refreshFollowups"/>
                </td>
              </tr>
            </tbody>
          </v-table>
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
  </v-row>
</template>

<script>
import { useInvoiceStore } from "@/store/invoices";
import { useAuthStore } from "@/store/auth";

export default {
  data() {
    return {
      invoice: useInvoiceStore().$state.invoice,
      active_balance: [],
      followups: reactive([]),
    };
  },
  mounted: async function () {
    const auth = useAuthStore();
    const options = {
      method: "get",
      baseURL: auth.$state.baseUrl,
      headers: {
        Authorization: `Bearer ${auth.$state.access_token}`,
      },
    };
    try {
      this.active_balance = await $fetch(
        `/api/active_balance/${this.invoice.InvoiceId}`,
        options
      );
      this.followups = await $fetch(
        `/api/followup/${this.invoice.InvoiceId}`,
        options
      );
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    roundedBalance: (balance) =>
      Math.round((balance + Number.EPSILON) * 100) / 100,
    async refreshFollowups() {
      const auth = useAuthStore();
      const invoiceStore = useInvoiceStore();
      const options = auth.defineOptions('GET');
      // const options = {
      //   method: "get",
      //   baseURL: auth.$state.baseUrl,
      //   headers: {
      //     Authorization: `Bearer ${auth.$state.access_token}`,
      //   },
      //};
      console.log(options)
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
