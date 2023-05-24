<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ props }">
      <v-btn elevation="4" color="indigo-lighten-2" v-bind="props"
        ><v-icon>mdi-pencil-outline</v-icon> Editar Detalles</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Editar detalles de factura (s)</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Centro:"
                v-model="invoiceFields.Workplace"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Fecha probable de pago"
                type="date"
                hint="Este dato es únicamente una estimación interna."
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Notas:"
                v-model="invoiceFields.InvoiceNotes"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="updateDetails(invoiceFields)"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  invoices: Array,
});
</script>

<script>
import { useInvoiceStore } from "@/store/invoices";
import { useAuthStore } from "@/store/auth";

export default {
  data() {
    return {
      dialog: false,
      invoiceFields: {
        Workplace: "",
        InvoiceNotes: "",
      },
    };
  },
  methods: {
    async updateDetails(payload) {
      const auth = useAuthStore();
      const invoiceStore = useInvoiceStore();
      const options = {
        method: "put",
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`,
        },
      };
      options.body = payload;
      this.invoices.filter(e=>e).forEach(async (invoice) => {
         try {
           let response = await $fetch(
             `/api/invoice/${invoice.InvoiceId}`,
             options
           );
         } catch (error) {
           console.log(error);
         }
       });
      this.dialog = false;
      this.$emit('update-details')
    },
  },
};
</script>
