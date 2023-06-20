<template>
    <v-container fluid style="margin-top: 5%">
      <v-row justify="end" align="center">
        <InvoiceSearch @show-results="setInvoices" @order-by-invoice="orderByInvoice" @sort-by-field="orderByField" @sort-by-action="orderByAction"/>
        <v-col cols="6" sm="8" md="8" >
          <v-pagination
            :length="pagination.length"
            v-model="pagination.page"
            @click="updatePagination"
          >
          </v-pagination>
          <InvoiceCard
            v-for="(invoice, i) in pageList"
            :invoice="invoice"
            :key="i"
            @click.native="getInvoice(invoice)"
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
  import { useInvoiceStore } from "@/store/invoices";
  export default {
    data() {
      return {
        currentOrder: 'desc',
        invoiceList: reactive([]),
        pageList: [],
        pagination: {
          length: 0,
          page: 1,
          limit: 10,
        },
      };
    },
    methods: {
      // Obtiene el array de Invoices que emite el componente de búsqueda y lo guarda en un array con todos los datos
      setInvoices(invoices) {
        this.invoiceList.splice(0);
        this.pageList.splice(0);
        invoices.forEach((invoice, i) => {
          this.invoiceList[i] = invoice;
          this.invoiceList[i].Balance = Math.round(((this.invoiceList[i].Balance + Number.EPSILON) * 100))/100
        });
        this.showResults();
      },
      //Vamos a paginar el resultado total y mostrar las facturas de 10 en 10
      showResults() {
        let totalLength = this.invoiceList.length;
        this.pagination.length = Math.ceil(totalLength / this.pagination.limit);
        let currentIndex = this.pagination.limit * (this.pagination.page - 1);
        let currentLimit = currentIndex + this.pagination.limit;
        let x = 0;
  
        this.invoiceList.forEach((invoice, i) => {
          if (i >= currentIndex && i < currentLimit) {
            this.pageList[x] = this.invoiceList[i];
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
      async getInvoice(invoice) {
        let id = toRaw(invoice);
        const invoiceStore = useInvoiceStore();
        try {
          let response = await invoiceStore.fetchInvoice(id.InvoiceId);
          this.$router.push({ name: "invoices-invoice" });
        } catch (error) {
          console.log(error);
        }
      },
      orderByInvoice(order) {
        this.currentOrder = order
        if (order.order === 'asc') {
          this.invoiceList.sort((a,b) => {
            const invoiceA = a.InvoiceNumber
            const invoiceB = b.InvoiceNumber
            return invoiceA > invoiceB?1:-1
          })
          this.updatePagination()
        } else if (order.order === 'desc') {
          this.invoiceList.sort((a,b) => {
            const invoiceA = a.InvoiceNumber
            const invoiceB = b.InvoiceNumber
            return invoiceA > invoiceB?1:-1
          }).reverse()
          this.updatePagination()
        }
      },
      orderByField(field) {
          const key = field
          if (this.currentOrder === 'asc') {
            this.invoiceList.sort((a,b) => {
              const invoiceA = a[key]
              const invoiceB = b[key]
              if (invoiceA > invoiceB) return 1
              if (invoiceA < invoiceB) return -1
              return 0
            })
            this.updatePagination()
          } else {
            this.invoiceList.sort((a,b) => {
              const invoiceA = a[key]
              const invoiceB = b[key]
              if (invoiceA < invoiceB) return 1
              if (invoiceA > invoiceB) return -1
              return 0
            })
            this.updatePagination()
          }
      },
      orderByAction(action) {
        //Pendiente desarrollar
      }
    },
  };
  </script>
  