<template>
  <v-container class="mt-10">
    <v-row>
      <v-col cols="2">
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
            <v-list-item v-for="(n, i) in picklist" :key="i" link @click="this.updateSheet(i)">
              <v-list-item-title> {{ n.name }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet min-height="70vh" rounded="lg">
          <!-- Sección Cuenta -->
          <v-container v-if="picklist[0].active" fluid>
            <v-card>
              <v-card-title>
                DETALLES DE CUENTA
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container fluid>
                  <v-row>
                    <v-col>
                      Grupo de Clientes: {{ customer.customer_group?.GroupLabel }}
                    </v-col>
                    <v-col>
                      Estado:
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Gerente de zona:
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
                      Gestor de cobro: {{ customer.empcollection_manager?.EmployeeName }}
                    </v-col>
                    <v-col>
                      Reparto de deuda:
                    </v-col>
                  </v-row>
                  <v-row cols="12" md="12">
                    <v-col>
                      Notas de cliente: 
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-container>
          <!-- Sección Contacto -->
          <v-container v-if="picklist[1].active" fluid>
            <v-card>
              <v-card-title>
                CONTACTO
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      Direccion: {{ customer.Address1 }}
                    </v-col>
                    <v-col>
                      Codigo Postal: {{ customer.PostalCode }}
                    </v-col>
                    <v-col>
                      Población: {{ customer.City }}
                    </v-col>
                    <v-col>
                      Provincia: {{ customer.Province }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Persona de Contacto: {{ customer.ContactName }}
                    </v-col>
                    <v-col>
                      Departamento: {{ customer.Department  }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Teléfono Particular: {{ customer.Phone }}
                    </v-col>
                    <v-col>
                      Teléfono Administración: {{ customer.AdministrativePhone }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Correo Electrónico: {{ customer.ContactEmail }}
                    </v-col>
                    <v-col>
                      Correo Administración: {{ customer.EmailContact }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useCustomerStore } from '@/store/customers';

definePageMeta({
  middleware: ["auth"],
});

export default {
  data() {
    return {
      picklist: [
        { name: "Cuenta", active: true },
        { name: "Contacto", active: false },
        { name: "Historial de Facturas", active: false },
        { name: "Historial de acciones", active: false },
        { name: "Planes de Pago", active: false },
      ],
      customer: useCustomerStore().$state.customer,
    }
  },
  // mounted: {
  //   async fetchRep() {
  //     const customerStore = useCustomerStore()
  //     try {
  //       let response = await customerStore.fetchSalesRep(this.customer.sales_rep.SalesRepId)
  //       console.log(response)
  //     } catch (error) {
        
  //     }
  //   }
  // },
  methods: {
    updateSheet(i) {
      this.picklist.forEach(e => e.active = false)
      this.picklist[i].active = true
      console.log(this.customer)
    }
  }
};
</script>

<style lang="scss" scoped></style>
