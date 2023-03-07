import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {},
    salesRep: {}
  }),
  getters: {
    getCustomer: (state) => state.customer,
    getSalesRep: (state) => state.salesRep
  },
  actions: {
    async fetchCustomer(customerId:string) {
      const auth = useAuthStore();
      try {
        let customer = await $fetch(`/api/customer/${customerId}`, {
          method: "get",
          baseURL: auth.$state.baseUrl,
          headers: {
            Authorization: `Bearer ${auth.$state.access_token}`,
          }
        })
        if (customer) {
          this.updateCustomerStore(customer)
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchSalesRep(SalesRepId:string) {
      const auth = useAuthStore();
      try {
        let salesrep = await $fetch(`/api/salesrep/${SalesRepId}`, {
          method: "get",
          baseURL: auth.$state.baseUrl,
          headers: {
            Authorization: `Bearer ${auth.$state.access_token}`,
          }
        })
        if (salesrep) {
          this.updateSalesRepStore(salesrep)
        }
      } catch (error) {
        console.log(error)
      }
    },
    updateCustomerStore(customer: object) {
      this.customer = customer;
    },
    updateSalesRepStore(salesrep:object) {
      this.salesRep = salesrep
    }
  },
});
