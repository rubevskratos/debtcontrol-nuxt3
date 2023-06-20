<template>
  <v-container fluid style="margin-top: 5%">
    <v-row justify="end" align="center">
      <CustomerSearch @show-results="setCustomers" />
      <v-col cols="6" sm="8" md="8" >
        <v-pagination
          :length="pagination.length"
          v-model="pagination.page"
          @input="updatePagination"
        >
        </v-pagination>
        <CustomerCard
          v-for="(customer, i) in pageList"
          :customer="customer"
          :key="i"
          @click.native="getCustomer(customer)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>
<script>
import { useCustomerStore } from "@/store/customers";

export default {
  data() {
    return {
      customerList: [],
      pageList: [],
      pagination: {
        length: 0,
        page: 1,
        limit: 10,
      },
    };
  },
  methods: {
    // Obtiene el array de Customers que emite el componente de búsqueda y lo guarda en un array con todos los datos
    setCustomers(customers) {
      this.customerList.splice(0);
      this.pageList.splice(0);
      customers.forEach((customer, i) => {
        this.customerList[i] = customer;
      });
      this.showResults();
    },
    //Vamos a paginar el resultado total y mostrar los clientes de 10 en 10
    showResults() {
      let totalLength = this.customerList.length;
      this.pagination.length = Math.ceil(totalLength / this.pagination.limit);
      let currentIndex = this.pagination.limit * (this.pagination.page - 1);
      let currentLimit = currentIndex + this.pagination.limit;
      let x = 0;

      this.customerList.forEach((customer, i) => {
        if (i >= currentIndex && i < currentLimit) {
          this.pageList[x] = this.customerList[i];
          x++;
        }
      });
    },
    //Cada vez the hagamos click en el componente de paginación, ya sea en la flecha next o prev, como en las própias páginas, actualizaremos el resultado
    updatePagination() {
      //Primero limpiamos el array de resultados.
      this.pageList.splice(0);
      //Luego ejecutamos nuevamente la búsqueda.
      this.showResults();
    },
    async getCustomer(customer) {
      let id = toRaw(customer);
      const customerStore = useCustomerStore();
      try {
        let response = await customerStore.fetchCustomer(id.CustomerId);
        this.$router.push({ name: "customers-customer" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
