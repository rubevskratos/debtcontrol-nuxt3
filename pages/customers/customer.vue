<template>
    <v-row justify="center" align="top" class="fill-height pa-5 overflow-hidden">
      <v-col cols="12" xl="2" md="3" sm="3">
        <v-sheet rounded>
          <v-list rounded elevation="2">
            <v-card color="#1F7087">
              <v-card-title class="text-h6 text-wrap text-white">
                {{ customer.CustomerName }}
              </v-card-title>
              <v-card-subtitle class="text-white">
                {{ customer.CustomerCode }}
              </v-card-subtitle>
            </v-card>
            <v-list-item
              v-for="(n, i) in picklist"
              :key="i"
              link
              @click="this.updateSheet(i)"
            >
              <v-list-item-title> {{ n.name }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet rounded="lg" class="overflow-hidden">
          <!-- Sección Cuenta -->
          <v-container v-if="picklist[0].active" fluid>
            <v-card>
              <v-card-title> DETALLES DE CUENTA </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container fluid>
                  <v-row>
                    <v-col>
                      Grupo de Clientes:
                      {{ customer.customer_group?.GroupLabel }}
                    </v-col>
                    <v-col> Estado: {{ customer.Status }} </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Gerente de zona: {{ customer.sales_rep?.Manager }}
                    </v-col>
                    <v-col>
                      Delegado: {{ customer.sales_rep?.SalesRepName }}
                    </v-col>
                    <v-col>
                      Telesales: {{ customer.telesales_rep?.SalesRepName }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Gestor de cobro:
                      {{ customer.empcollection_manager?.EmployeeName }}
                    </v-col>
                    <v-col> Reparto de deuda: </v-col>
                  </v-row>
                  <v-row cols="12" md="12">
                    <v-col> Notas de cliente: </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-dialog v-model="dialog" width="30%">
                  <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> Editar </v-btn>
                  </template>

                  <v-card>
                    <v-card-text>
                      <v-form>
                        <v-select label="Reparto de deuda"> </v-select>
                        <v-textarea label="Notas del cliente"> </v-textarea>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="primary" @click="dialog = false"
                        >Aceptar</v-btn
                      >
                      <v-btn color="error" @click="dialog = false"
                        >Cancelar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
          </v-container>
          <!-- Sección Contacto -->
          <v-container v-if="picklist[1].active" fluid>
            <v-card>
              <v-card-title> CONTACTO </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col> Direccion: {{ customer.Address1 }} </v-col>
                    <v-col> Codigo Postal: {{ customer.PostalCode }} </v-col>
                    <v-col> Población: {{ customer.City }} </v-col>
                    <v-col> Provincia: {{ customer.Province }} </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Persona de Contacto: {{ customer.ContactName }}
                    </v-col>
                    <v-col> Departamento: {{ customer.Department }} </v-col>
                  </v-row>
                  <v-row>
                    <v-col> Teléfono Particular: {{ customer.Phone }} </v-col>
                    <v-col>
                      Teléfono Administración:
                      {{ customer.AdministrativePhone }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Correo Electrónico: {{ customer.EmailContact }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-dialog v-model="dialog" width="30%">
                  <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> Editar </v-btn>
                  </template>

                  <v-card>
                    <v-card-text>
                      <v-form>
                        <v-text-field
                          v-model="inputData.Department"
                          label="Departamento"
                        />
                        <v-text-field
                          v-model="inputData.ContactName"
                          label="Persona de contacto"
                        />
                        <v-text-field
                          v-model="inputData.Phone"
                          label="Teléfono Particular"
                        />
                        <v-text-field
                          v-model="inputData.EmailContact"
                          type="Email"
                          label="Correo Electrónico"
                        />
                        <v-text-field
                          v-model="inputData.AdministrativePhone"
                          label="Teléfono Administración"
                        />
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="primary" @click="updateCustomer()"
                        >Aceptar</v-btn
                      >
                      <v-btn color="error" @click="dialog = false"
                        >Cancelar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
          </v-container>
          <!-- Sección Histórico -->
          <v-container v-if="picklist[2].active" fluid class="overflow-auto" style="max-height: 90vh;">
            <v-pagination
              :length="pagination.length"
              v-model="pagination.page"
              @click="updatePagination('history')"
            >
            </v-pagination>
                <InvoiceCard
                  v-for="(invoice, i) in invoiceHistory"
                  :invoice="invoice"
                  :key="i"
                />
          </v-container>
          <v-container v-if="picklist[3].active" fluid class="overflow-auto" style="max-height: 90vh;">
            <v-pagination
              :length="pagination.length"
              v-model="pagination.page"
              @click="updatePagination('actions')"
            >
            </v-pagination>
                <InvoiceCard
                  v-for="(invoice, i) in invoiceActions"
                  :invoice="invoice"
                  :key="i"
                />
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
</template>

<script>
import { useCustomerStore } from "@/store/customers";
import { useAuthStore } from "@/store/auth";

definePageMeta({
  middleware: ["auth"],
});

export default {
  data() {
    return {
      dialog: false,
      picklist: [
        { name: "Cuenta", active: true },
        { name: "Contacto", active: false },
        { name: "Historial de Facturas", active: false },
        { name: "Historial de acciones", active: false },
        { name: "Planes de Pago", active: false },
      ],
      customer: useCustomerStore().$state.customer,
      invoiceHistory: [],
      invoiceActions: [],
      inputData: {
        Department: "",
        EmailContact: "",
        Phone: "",
        ContactName: "",
        AdministrativePhone: "",
      },
      pageList: [],
      pagination: {
        length: 0,
        page: 1,
        limit: 10,
      },
    };
  },
  methods: {
    updatePagination(type) {
      if(type === 'history') {
        this.invoiceHistory.splice(0);
        this.getInvoices(type)
      } else {
        this.invoiceActions.splice(0);
        this.getInvoices(type)
      }
    },
    updateSheet(i) {
      this.picklist.forEach((e) => (e.active = false));
      this.picklist[i].active = true;
      this.pagination.page = 1
      this.pagination.length = 0
      if (this.picklist[2].active) {
        this.getInvoices('history');
      } else if (this.picklist[3].active) {
        this.getInvoices('actions')
      }
    },
    async updateCustomer() {
      // Nos quedamos únicamente con los parámetros que contengan datos
      const body = {};
      for (const key in this.inputData) {
        if (this.inputData[key]) {
          body[key] = this.inputData[key];
        }
      }
      // Iniciamos la instancia de usuario
      const auth = useAuthStore();
      const options = {
        method: "put",
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`,
        }
      };
      options.body = body
      const endpoint = `/api/customer/${this.customer.CustomerId}`;
      try {
        let response = await $fetch(endpoint, options);
        this.customer = response
      } catch (error) {
        console.log(error);
      }
    },
    async getInvoices(type) {
      const auth = useAuthStore();
      const options = {
        method: "get",
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`,
        },
      };
      const params = {
        Active: false,
        CustomerName: this.customer.CustomerName,
      };
      options.params = params;
  
      if (type === 'actions') {
       options.params.Active = true
      }

      try {
        let invoices = await $fetch("/api/invoice", options);
        this.showResults(invoices, type);
      } catch (error) {
        console.log(error);
      }
    },
    showResults(invoiceList, type) {
      let totalLength = invoiceList.length;
      this.pagination.length = Math.ceil(totalLength / this.pagination.limit);
      let currentIndex = this.pagination.limit * (this.pagination.page - 1);
      let currentLimit = currentIndex + this.pagination.limit;
      let x = 0;

      invoiceList.forEach((invoice, i) => {
        if (i >= currentIndex && i < currentLimit) {
          if (type === "history") {
            this.invoiceHistory[x] = invoiceList[i];
          } else if (type === "actions") {
            this.invoiceActions[x] = invoiceList[i];
          }
          x++;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
