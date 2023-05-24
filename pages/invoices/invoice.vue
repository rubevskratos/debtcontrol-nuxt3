<template>
  <v-row justify="center" align="start">
    <!-- Detalles de factura-->
    <v-col cols="12" md="12">
      <v-card class="mt-5">
        <v-card-actions>
          <h3 class="pa-1">Detalles de factura:</h3>
          <v-spacer />
          <!-- Actualización de detalles de factura-->
          <v-dialog v-model="dialog" persistent>
            <template v-slot:activator="{ props }">
              <v-btn elevation="4" color="indigo-lighten-2" v-bind="props"
                >Editar detalles</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Editar detalles de factura</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Centro:"
                        v-model="invoiceFields.Workplace"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Fecha probable de pago"
                        type="date"
                        hint="Este dato es únicamente una estimación interna."
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        label="Notas:"
                        v-model="invoiceFields.InvoiceNotes"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="updateDetails(invoiceFields)"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Actualización de detalles de mantis -->
          <v-dialog v-model="dialogMantis" persistent>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                elevation="4"
                color="indigo-lighten-2"
                v-if="!invoice.EmployeeMantis_id"
                >Asociar Mantis</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Asociar Mantis</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        label="Empleado Mantis"
                        :items="employees"
                        item-title="EmployeeName"
                        item-value="EmployeeId"
                        v-model="mantisFields.EmployeeMantis_id"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        label="Usuario Error Mantis"
                        :items="employees"
                        item-title="EmployeeName"
                        item-value="EmployeeId"
                        v-model="mantisFields.EmployeeBugMantis_id"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        label="Motivo de Incidencia"
                        :items="incidenceCauses"
                        item-title="IncidenceName"
                        item-value="IncidenceCauseId"
                        v-model="mantisFields.IncidenceCause_id"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Fecha de Incidencia Mantis"
                        v-model="mantisFields.IncidenceDate"
                        type="date"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-textarea
                        label="Comentario CS"  
                        v-model="mantisFields.CSFollowUpPayment"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-textarea
                        label="Comentario Finanzas"  
                        v-model="mantisFields.FinanceFollowUpPayment"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialogMantis = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="updateDetails(mantisFields)"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
          <new-action-component :invoices="[invoice]"/>
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
                  <v-btn @click="deleteFollowUp(followup.FollowUpId)"><v-icon icon="mdi-delete-outline" /></v-btn>
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
      dialog: false,
      dialogMantis: false,
      dialogFollowUps: false,
      invoice: useInvoiceStore().$state.invoice,
      employees: [],
      incidenceCauses: [],
      active_balance: [],
      followups: [],
      invoiceFields: {
        Workplace: useInvoiceStore().$state.invoice.Workplace,
        InvoiceNotes: useInvoiceStore().$state.invoice.InvoiceNotes,
      },
      mantisFields: {
        EmployeeMantis_id: "",
        IncidenceCause_id: "",
        EmployeeBugMantis_id: "",
        IncidenceDate: "", //yyyy-mm-dd
        FinanceFollowUpPayment: "",
        CSFollowUpPayment: ""
      }
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
      this.employees = await $fetch("/api/employee", options);
      this.employees = this.employees.filter((e) => e.Status);
      this.incidenceCauses = await $fetch("/api/incidence_cause", options);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    roundedBalance: (balance) =>
      Math.round((balance + Number.EPSILON) * 100) / 100,
    async updateDetails(payload) {
      const auth = useAuthStore();
      const invoiceStore = useInvoiceStore();
      const options = {
        method: "put",
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`,
        },
      };
      options.body = payload;
      try {
        let response = await $fetch(
          `/api/invoice/${this.invoice.InvoiceId}`,
          options
        );
        invoiceStore.fetchInvoice(this.invoice.InvoiceId);
        this.invoice = response;
        this.dialog = false;
        this.dialogMantis = false;
        console.log(this.invoice)
      } catch (error) {
        console.log(error);
      }
    },
    deleteFollowUp(id) {
      console.log(`Se borraría el mensaje con id: ${id}`)
    },
  },
};
</script>

<style lang="scss" scoped></style>
