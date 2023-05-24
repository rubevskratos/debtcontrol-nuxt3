<template>
  <v-dialog v-model="dialog" persistent max-width="50%">
    <template v-slot:activator="{ props }">
      <v-btn elevation="4" color="indigo-lighten-2" v-bind="props"
        >Nueva acción</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Nueva acción</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="6">
              <v-select
                label="Acción"
                :items="actions"
                item-title="ActionName"
                item-value="ActionId"
                v-model="newFollowUp.Action_id"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Motivo de la acción"
                v-model="newFollowUp.Motive"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea label="Resultado" v-model="newFollowUp.Result">
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Próxima Cita"
                type="date"
                v-model="newFollowUp.NextAppointmentDate"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat
          @click.native="dialog = false"
          >Close</v-btn
        >
        <v-btn color="blue darken-1" flat @click.native="createNewFollowUp"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  const props = defineProps({
    invoices: Array
  })
</script>

<script>
import { useAuthStore } from "@/store/auth";
import { useInvoiceStore } from "@/store/invoices";


export default {
  data() {
    return {
      actions: [],
      dialog: false,
      newFollowUp: {
        Invoice_id: "",
        Action_id: "",
        NextAppointmentDate: "", //yyyy-mm-dd
        Motive: "",
        Result: "",
      },
      errors: []
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
      this.actions = await $fetch('/api/action', options)
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async createNewFollowUp() {
      const auth = useAuthStore()
      const options = {
        method:'post',
        baseURL:auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`
        }
      }
      options.body = this.newFollowUp
      console.log(this.invoices)
      this.invoices.forEach(async invoice => {
        try {
          options.body.Invoice_id = invoice.InvoiceId
          console.log(options)
          const response = await $fetch('/api/followup', options)
        } catch (error) {
          console.log(error)
          this.errors.push(error)
        }
      })
      this.dialog = false
      this.$emit('new-followup')
    },
    flushForm() {
      this.newFollowUp.Action_id = ""
      this.newFollowUp.NextAppointmentDate = ""
      this.newFollowUp.Date = ""
      this.newFollowUp.Motive = ""
      this.newFollowUp.Result = ""
    }
  }
};
</script>

<style lang="scss" scoped></style>
