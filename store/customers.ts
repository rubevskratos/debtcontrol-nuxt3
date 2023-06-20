import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

type Customer = any; // Actualiza esto con la estructura de tus datos
type SalesRep = any; // Actualiza esto con la estructura de tus datos
type PayPlans = any; // Actualiza esto con la estructura de tus datos

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {} as Customer,
    salesRep: {} as SalesRep,
    payplans: {} as PayPlans
  }),
  getters: {
    getCustomer: (state) => state.customer,
    getSalesRep: (state) => state.salesRep
  },
  actions: {
    async fetchData(endpoint: string, id: string) {
      const auth = useAuthStore();
      try {
        return await $fetch(`/api/${endpoint}/${id}`, {
          method: "get",
          baseURL: auth.$state.baseUrl,
          headers: {
            Authorization: `Bearer ${auth.$state.access_token}`,
          }
        });
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async fetchCustomer(customerId: string) {
      let customer: Customer = await this.fetchData('customer', customerId);
      if (customer) {
        this.customer = customer;
        await this.fetchPayPlans(this.customer.CustomerId);
      }
    },
    async fetchSalesRep(SalesRepId: string) {
      let salesrep: SalesRep = await this.fetchData('salesrep', SalesRepId);
      if (salesrep) {
        this.salesRep = salesrep;
      }
    },
    async fetchPayPlans(CustomerId: string) {
      let payplans: PayPlans = await this.fetchData('payplan', CustomerId);
      if (payplans) {
        this.payplans = payplans;
      }
    },
  },
});