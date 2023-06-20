<template>
  <v-dialog v-model="dialog" width="80%">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"
        ><v-icon>mdi-pencil-outline</v-icon> VER DETALLES
      </v-btn>
    </template>

    <v-card>
      <v-card-text>
        <v-card v-for="(invoice, i) in invpayplan" :key="i">
            <v-card-text>
                <v-form>
                    <v-row cols="12">
                        <v-col cols="12">
                            
                        </v-col>
                        <v-col cols="2">
                            <v-checkbox label="Burofax" v-model="invoice.Burofax"></v-checkbox>
                        </v-col>
                        <v-col cols="2">
                            <v-checkbox label="Monitoring" v-model="invoice.Monitoring"></v-checkbox>
                        </v-col>
                        <v-col cols="2">
                            <v-checkbox label="Paid" v-model="invoice.Paid"></v-checkbox>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="dialog=false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
    payplanid: Number,
});
</script>

<script>
import { useCustomerStore } from "@/store/customers";

export default {
    data() {
        return {
            invpayplan: [],
            dialog: false
        }
    },
    mounted: async function () {
        const CustomerStore = useCustomerStore();
        try {
            this.invpayplan = await CustomerStore.fetchInvPayPlans(this.payplanid)
        } catch (error) {
            
        }
    }
}
</script>

<style lang="scss" scoped></style>
