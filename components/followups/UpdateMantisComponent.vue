<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        elevation="4"
        color="indigo-lighten-2"
        v-if="!invoice.EmployeeMantis_id"
        >Asociar Mantis</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Asociar Mantis</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-select
                label="Empleado Mantis"
                :items="employees"
                item-title="EmployeeName"
                item-value="EmployeeId"
                v-model="mantisFields.EmployeeMantis_id"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                label="Usuario Error Mantis"
                :items="employees"
                item-title="EmployeeName"
                item-value="EmployeeId"
                v-model="mantisFields.EmployeeBugMantis_id"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                label="Motivo de Incidencia"
                :items="incidenceCauses"
                item-title="IncidenceName"
                item-value="IncidenceCauseId"
                v-model="mantisFields.IncidenceCause_id"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Fecha de Incidencia Mantis"
                v-model="mantisFields.IncidenceDate"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-textarea
                label="Comentario CS"
                v-model="mantisFields.CSFollowUpPayment"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-textarea
                label="Comentario Finanzas"
                v-model="mantisFields.FinanceFollowUpPayment"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="updateDetails(mantisFields)"
        >
          Save
        </v-btn>
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
import { useAuthStore } from "@/store/auth";

export default {
  data() {
    return {
      dialog: false,
      employees: [],
      incidenceCauses: [],
      mantisFields: {
        EmployeeMantis_id: "",
        IncidenceCause_id: "",
        EmployeeBugMantis_id: "",
        IncidenceDate: "", //yyyy-mm-dd
        FinanceFollowUpPayment: "",
        CSFollowUpPayment: "",
      },
    };
  },
  mounted: async function () {
    const auth = useAuthStore();
    const options = {
      method: "get",
      baseURL: auth.$state.baseUrl,
      headers: {
        Authorization: `Bearer ${auth.$state.access_token}`,
      },
    };
    try {   
        this.employees = await $fetch("/api/employee", options);
        this.employees = this.employees.filter((e) => e.Status);
        this.incidenceCauses = await $fetch("/api/incidence_cause", options);
    } catch (error) {
        
    }
  },
  methods: {
    async updateDetails(payload) {
      const auth = useAuthStore();
      const options = {
        method: "put",
        baseURL: auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`,
        },
      };
      options.body = payload;
      try {
        let response = await $fetch(
          `/api/invoice/${this.invoice.InvoiceId}`,
          options
        );        
        this.dialog = false;
        this.$emit('update-mantis')
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
