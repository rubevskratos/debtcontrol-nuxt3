<template>
  <v-navigation-drawer>
    <v-card color="primary">
      <v-card-title> Invoice Search </v-card-title>
    </v-card>
    <v-form style="padding: 5px">
      <v-card>
        <v-card-text>
          Ordenar
          <v-radio-group>
            <v-radio label="Ascendente" value="asc" @click="$emit('order-by-invoice', {order:'asc'})"></v-radio>
            <v-radio label="Descendente" value="desc" @click="$emit('order-by-invoice', {order:'desc'})"></v-radio>
          </v-radio-group>
          <v-divider />
          Ordenar por
          <v-select
            density="compact"
            :items="fields"
            v-model="sortByField"
            label="Campo..."
            @update:model-value="sortByFieldEvent"
          ></v-select>
          <v-divider />
          Filtros:
          <v-switch
          v-model="Active"
          hide
          inset
          :label="`Active: ${Active.toString()}`"
          ></v-switch>
          <v-select
            clearable
            density="compact"
            :items="actions"
            item-title="IncidenceName"
            item-value="IncidenceId"
            v-model="sortByAction"
            label="Tipo de acción..."
          ></v-select>
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
            v-model="params.CustomerCode"
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
      minDate: this.initialDate(),
      maxDate: this.today(),
      params: {
        CustomerCode: "",
        CustomerName: "",
        InvoiceNumber: "",
        FromInvoiceDate: "",
        ToInvoiceDate: ""
      },
      actions: [],
      sortByField: "",
      sortByAction: "",
      limit: 0,
      Active: false,
      fields: []
    };
  },
  methods: {
    today() {
      const date = new Date()
      const dateText = date.toJSON()
      const day = dateText.split('-')[2].split('T')[0]
      const month = dateText.split('-')[1]
      const year = dateText.split('-')[0]
      const today = `${year}-${month}-${day}`
      return today
    },
    initialDate() {
      const date = new Date()
      date.setMonth(date.getMonth()-3)
      const dateText = date.toJSON()
      const day = dateText.split('-')[2].split('T')[0]
      const month = dateText.split('-')[1]
      const year = dateText.split('-')[0]
      const initialDate = `${year}-${month}-${day}`
      return initialDate
    },
    updateFields(fields) {
      this.fields = fields
    },
    createParams(parent) {
      const child = {};
      if (this.minDate) {
        parent.FromInvoiceDate = this.minDate
      }
      if (this.maxDate) {
        parent.ToInvoiceDate = this.maxDate
      }
      for (const key in parent) {
        if (parent[key]) {
          child[key] = parent[key];
        }
      }
      return child;
    },
    sortByFieldEvent() {
      this.$emit('sort-by-field', this.sortByField)
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
        } else {
            this.params.Active = false
        }

        const params = this.createParams(this.params);
        options.params = params;
        let invoices = await $fetch("/api/invoice", options);
        //Redondeamos el balance
        invoices.forEach((invoice, i) => {
          invoices[i].Balance = this.roundedBalance(invoice.Balance)
        })
        this.$emit("show-results", invoices);
      } catch (error) {
        console.log("Error on getInvoices in InvoiceSearch" + error);
      }
    },
    roundedBalance: (balance) =>
      Math.round((balance + Number.EPSILON) * 100) / 100,
  },
  async mounted() {
       const auth = useAuthStore()
       const options = {
         method: "GET",
         baseURL: auth.$state.baseUrl,
         headers: {
           Authorization: `Bearer ${auth.$state.access_token}`
         }
       }
       const fields = []
       try {
         let invoice = await $fetch("/api/invoice/1", options)
         let incidenceCauses = await $fetch("/api/incidence_cause", options)
         for (const key in invoice) {
           if (Object.hasOwnProperty.call(invoice, key)) {
             const element = invoice[key];
             if (key != 'Active') { 
               this.fields.push(key)            
             }
           }
         }
         incidenceCauses.forEach(incidence => this.actions.push(incidence))
       } catch (error) {
         console.log(error)
       }
  }
};
</script>
