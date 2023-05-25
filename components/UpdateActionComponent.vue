<template>
  <v-dialog v-model="dialog" persistent max-width="50%">
    <template v-slot:activator="{ props }">
      <v-btn elevation="4" color="indigo-lighten-2" v-bind="props"
        ><v-icon>mdi-pencil-outline</v-icon></v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Editar Acción</span>
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
                v-model="updateFollowUp.Action_id"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Motivo de la acción"
                v-model="updateFollowUp.Motive"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                label="Persona de Contacto"
                :items="customer_contacts"
                item-title="ContactName"
                item-value="ContactId"
                v-model="updateFollowUp.CustomerContact_id"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea label="Resultado" v-model="updateFollowUp.Result">
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Próxima Cita"
                type="date"
                v-model="updateFollowUp.NextAppointmentDate"
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
        <v-btn color="blue darken-1" flat @click.native="UpdateFollowUp"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  const props = defineProps({
    followup: Object,
    customer: Object
  })
</script>

<script>
import { useAuthStore } from "@/store/auth";

export default {
  data() {
    return {
      actions: [],
      dialog: false,
      updateFollowUp: {
        Action_id: this.followup.Action_id,
        NextAppointmentDate: this.followup.NextAppointmentDate, //yyyy-mm-dd
        Motive: this.followup.Motive,
        Result: this.followup.Result
      },
      errors: [],
      customer_contacts: []
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
      if(this.customer.CustomerId) {
        this.customer_contacts = await $fetch(`/api/customer_contact/${this.customer.CustomerId}`, options)
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async UpdateFollowUp() {
      const auth = useAuthStore()
      const options = {
        method:'put',
        baseURL:auth.$state.baseUrl,
        headers: {
          Authorization: `Bearer ${auth.$state.access_token}`
        }
      }
      options.body = this.updateFollowUp
      console.log(options.body)
        try {
          const response = await $fetch(`/api/followup/${this.followup.FollowUpId}`, options)
          this.dialog = false
          this.$emit('update-followup')
        } catch (error) {
          console.log(error)
          this.errors.push(error)
        }
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
