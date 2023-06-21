import { createElementBlock } from "nuxt/dist/app/compat/capi";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

type Customer = any; // Actualiza esto con la estructura de tus datos
type SalesRep = any; // Actualiza esto con la estructura de tus datos
type PayPlans = any; // Actualiza esto con la estructura de tus datos
type PayPlan = any;
type InvPayPlans = any;
type PayPlanStatus = {
  summary: {
    totalAmount: number,
    paidAmount: number,
    remainingAmount: number,
  },
  data: { 
    series: [number],
    chartOptions: {
      chart: {
        height: number,
        type: string,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: string,
          }
        },
      },
      labels: [string],
    }
  }

}

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {} as Customer,
    salesRep: {} as SalesRep,
    payplans: [] as PayPlans,
    invpayplans: [] as InvPayPlans,
    payplanStatus: {} as PayPlanStatus
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
    async fetchInvPayPlans(PayPlanId: string) {
      let invpayplan: InvPayPlans = await this.fetchData('invpayplan', PayPlanId);
      if (invpayplan) {
        this.invpayplans = invpayplan
        this.fetchPayPlanStatus(this.payplans)
        return this.invpayplans
      }
    },
    fetchPayPlanStatus(payplan: []) {
      let totalAmount = 0
      let remainingAmount = 0
      let paidAmount = 0
      let series = 0

      payplan.forEach(function(element: PayPlan) {
        totalAmount += element.totalAmount,
        paidAmount += element.amount_paid
      });

      remainingAmount = totalAmount - paidAmount
      series = paidAmount/totalAmount
      series = Math.round((series + Number.EPSILON) * 100) / 100,

      this.payplanStatus.data.series[0] = series
      this.payplanStatus.data.chartOptions.labels[0] = series < 1?'Progreso':'Pagado'
      this.payplanStatus.data.chartOptions.plotOptions.radialBar.hollow.size = series.toString() + '%'
    }
  },
});