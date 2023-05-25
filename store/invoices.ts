import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    invoice: {},
    active_balance: []
  }),
  getters: {
    getInvoice: (state) => {
      state.invoice
    }
  },
  actions: {
    async fetchInvoice(invoiceId:string) {
      const auth = useAuthStore();
      const options = auth.defineOptions("GET")

      try {
        let invoice = await $fetch(`/api/invoice/${invoiceId}`, options)
        if (invoice) {
          this.updateInvoiceStore(invoice)
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchInvoiceBalance(invoiceId:string) {
      const auth = useAuthStore()
      const options = auth.defineOptions("GET")

      try {
        let response = await $fetch(`/api/active_balance/${invoiceId}`, options)
        this.updateActiveBalance(response)
      } catch (error) {
        console.log(error)
      }

    },
    updateInvoiceStore(invoice: object) {
      this.invoice = invoice;
    },
    updateActiveBalance(active_balance: any) {
      this.active_balance = active_balance
    }
  },
});
