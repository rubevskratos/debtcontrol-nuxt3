import { createElementBlock } from "nuxt/dist/app/compat/capi";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

type Customer = any; // Actualiza esto con la estructura de tus datos
type SalesRep = any; // Actualiza esto con la estructura de tus datos
type PayPlans = any; // Actualiza esto con la estructura de tus datos
type PayPlan = any;
type InvPayPlans = any;
type PayPlanStatus = any;

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {} as Customer,
    salesRep: {} as SalesRep,
    payplans: [] as PayPlans,
    invpayplans: [] as InvPayPlans,
    payplanStatus: {
      series: [], 
      labels: []
    } as PayPlanStatus,
  }),
  getters: {
    getCustomer: (state) => state.customer,
    getSalesRep: (state) => state.salesRep,
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
          },
        });
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async fetchCustomer(customerId: string) {
      let customer: Customer = await this.fetchData("customer", customerId);
      if (customer) {
        this.customer = customer;
        await this.fetchPayPlans(this.customer.CustomerId);
      }
    },
    async fetchSalesRep(SalesRepId: string) {
      let salesrep: SalesRep = await this.fetchData("salesrep", SalesRepId);
      if (salesrep) {
        this.salesRep = salesrep;
      }
    },
    async fetchPayPlans(CustomerId: string) {
      let payplans: PayPlans = await this.fetchData("payplan", CustomerId);
      if (payplans.length > 0) {
        this.payplans = payplans;
      } else {
        this.payplans = []
        this.invpayplans = []
        this.payplanStatus = {}
      }
    },
    async fetchInvPayPlans(PayPlanId: string) {
      let invpayplan: InvPayPlans = await this.fetchData(
        "invpayplan",
        PayPlanId
      );
      if (invpayplan) {
        this.invpayplans = invpayplan;
        return this.invpayplans;
      }
    },
    fetchPayPlanStatus(payplan: []) {
      let totalAmount = 0;
      let remainingAmount = 0;
      let paidAmount = 0;
      let series = 0;

      payplan.forEach(function (element: PayPlan) {
        (totalAmount += element.TotalAmount),
          (paidAmount += element.amount_paid);
      });

      remainingAmount = totalAmount - paidAmount;

      series = paidAmount / totalAmount;
      series = Math.round((series + Number.EPSILON) * 100) / 100;

      this.payplanStatus.series.push(series);
      this.payplanStatus.labels.push(series < 1 ? "Progreso" : "Pagado");
    },
    flushStore() {
      this.customer = {} as Customer,
      this.salesRep = {} as SalesRep,
      this.payplans = [] as PayPlans,
      this.invpayplans = [] as InvPayPlans,
      this.payplanStatus = {
        series: [], 
        labels: []
      } as PayPlanStatus
    }
  },
});
