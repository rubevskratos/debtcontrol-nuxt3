<template>
  <v-navigation-drawer>
    <v-card color="primary">
      <v-card-title> Invoice Search </v-card-title>
    </v-card>
    <v-form style="padding: 5px">
      <v-card>
        <v-card-text>
          Ordenar
          <v-radio label="Ascendente" value="asc"></v-radio>
          <v-radio label="Descendente" value="desc"></v-radio>
          <v-divider />
          Ordenar por
          <v-select
            density="compact"
            :items="fields"
            v-model="sortByField"
            label="Campo..."
          ></v-select>
          <v-select
            density="compact"
            :items="actions"
            v-model="sortByAction"
            label="Tipo de acción..."
          ></v-select>
          <v-divider />
          Filtros:
          <v-switch
            v-model="Active"
            hide-
            inset
            :label="`Active: ${Active.toString()}`"
          ></v-switch>
          <v-text-field
            density="compact"
            name="dateMin"
            label="Fecha Minima"
            id="dateMin"
            v-model="minDate"
            type="date"
          />
          <v-text-field
            name="dateMax"
            label="Fecha Máxima"
            id="dateMax"
            v-model="maxDate"
            type="date"
          />
          <v-text-field
            density="compact"
            name="customerCode"
            label="Código M3"
            id="customerCode"
            v-model="CustomerCode"
          />
          <v-text-field
            density="compact"
            name="customerName"
            label="Nombre Cliente"
            id="customerName"
            v-model="params.CustomerName"
          />
          <v-text-field
            density="compact"
            name="invoiceId"
            label="Número Factura"
            id="invoiceId"
            v-model="params.InvoiceNumber"
          />
        </v-card-text>
      </v-card>
      <v-divider class="mt-2 mb-2"></v-divider>
      <v-btn @click="getInvoices"> Buscar </v-btn>
    </v-form>
  </v-navigation-drawer>
</template>

<script>
import { useAuthStore } from "@/store/auth";

export default {
  data() {
    return {
      minDate: "",
      maxDate: "",
      params: {
        CustomerName: "",
        InvoiceNumber: "",
      },
      fields: [],
      actions: [],
      sortByField: "",
      sortByAction: "",
      CustomerCode: "",
      limit: 0,
      Active: false,
    };
  },
  // mounted: async function () {
  //   const auth = useAuthStore();
  //   const options = {
  //     method: "GET",
  //     baseURL: auth.$state.baseUrl,
  //     headers: {
  //       Authorization: `Bearer ${auth.$state.access_token}`,
  //     },
  //   };
  //   try {
  //     let Reps = await $fetch("/api/salesrep", options);
  //     Reps.filter((rep) => rep.Status).forEach((rep, i) => {
  //       this.RepNames[i] = rep.SalesRepName;
  //     });
  //     let Agents = await $fetch("/api/employee", options);
  //     Agents.filter((agent) => agent.Status).forEach((agent, i) => {
  //       this.EmployeeNames[i] = agent.EmployeeName;
  //     });
  //     let CustomerGroups = await $fetch("/api/cusgroup", options);
  //     CustomerGroups.forEach((group, i) => {
  //       this.CustomerGroupCodes[i] = {
  //         CusGroupCode: group.CusGroupCode,
  //         GroupLabel: group.GroupLabel,
  //       };
  //     });
  //   } catch (error) {
  //     console.log("Error after mount:" + error);
  //   }
  // },
  methods: {
    createParams(parent) {
      const child = {};
      for (const key in parent) {
        if (parent[key]) {
          child[key] = parent[key];
        }
      }
      return child;
    },
    async getInvoices() {
      const auth = useAuthStore();
      const options = {
        method: "GET",
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`,
        },
      };

      try {
        if (this.limit > 0) {
          this.params.Limit = this.limit;
        }
        if (this.Active) {
            this.params.Active = true
        }

        const params = this.createParams(this.params);
        options.params = params;

        let invoices = await $fetch("/api/invoice", options);
        
        this.$emit("show-results", invoices);
      } catch (error) {
        console.log("Error on getInvoices in InvoiceSearch" + error);
      }
    },
  },
};
</script>
