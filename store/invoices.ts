import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    invoice: {}
  }),
  getters: {
    getInvoice: (state) => {
      state.invoice
    }
  },
  actions: {
    async fetchInvoice(invoiceId:string) {
      const auth = useAuthStore();
      try {
        let invoice = await $fetch(`/api/invoice/${invoiceId}`, {
          method: "get",
          baseURL: auth.$state.baseUrl,
          headers: {
            Authorization: `Bearer ${auth.$state.access_token}`,
          }
        })
        if (invoice) {
          this.updateInvoiceStore(invoice)
        }
      } catch (error) {
        console.log(error);
      }
    },
    updateInvoiceStore(invoice: object) {
      this.invoice = invoice;
    },
  },
});
