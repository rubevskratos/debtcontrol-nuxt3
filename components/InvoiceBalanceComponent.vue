<template>
    <v-dialog v-model="dialog" persistent max-width="80%">
        <template v-slot:activator="{ props }">
          <v-btn elevation="4" color="indigo-lighten-2" dark v-bind="props"><v-icon>mdi-chart-box-outline</v-icon> Aging de Factura</v-btn>
        </template>
        <v-card>
        <v-card-text>
          <v-table>
            <thead>
              <th>Due Date</th>
              <th>Payment Method</th>
              <th>Not Due</th>
              <th>30 Days</th>
              <th>60 Days</th>
              <th>90 Days</th>
              <th>120 Days</th>
              <th>150 Days</th>
              <th>180 Days</th>
              <th>360 Days</th>
              <th>Older</th>
            </thead>
            <tbody>
              <tr v-for="item in active_balance" :key="item.ActiveBalanceId">
                <td>TBD</td>
                <td>TBD</td>
                <td>{{ roundedBalance(item.NotDue) }}</td>
                <td>{{ roundedBalance(item.Days30) }}</td>
                <td>{{ roundedBalance(item.Days60) }}</td>
                <td>{{ roundedBalance(item.Days90) }}</td>
                <td>{{ roundedBalance(item.Days120) }}</td>
                <td>{{ roundedBalance(item.Days150) }}</td>
                <td>{{ roundedBalance(item.Days180) }}</td>
                <td>{{ roundedBalance(item.Days360) }}</td>
                <td>{{ roundedBalance(item.Older) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
            <v-spacer/>
            <v-btn @click="dialog=false"><v-icon>mdi-close</v-icon> Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps({
    invoice: Object
})
</script>
<script>
    import { useInvoiceStore } from '@/store/invoices'

    export default {
      data() {
        return {
            dialog: false,
            active_balance: reactive([]),
        }
      },
      beforeMount: async function() {
        const invoiceStore = useInvoiceStore()
        
        try {
            //let response = await invoiceStore.fetchInvoiceBalance(this.invoice.InvoiceId)
            this.active_balance = invoiceStore.$state.active_balance
        } catch (error) {
            console.log(error)
        }
      },
      methods: {
        roundedBalance: (balance) => Math.round((balance + Number.EPSILON) * 100) / 100,
      }
    }
</script>

<style lang="scss" scoped>

</style>