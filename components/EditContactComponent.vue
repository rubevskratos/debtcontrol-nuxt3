<template>
  <v-dialog v-model="dialog" width="30%">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"><v-icon>mdi-pencil-outline</v-icon> Editar </v-btn>
    </template>

    <v-card>
      <v-card-text>
        <v-form>
          <v-text-field v-model="inputData.Department" label="Departamento" />
          <v-text-field
            v-model="inputData.ContactName"
            label="Nombre de contacto"
          />
          <v-text-field
            v-model="inputData.ContactLastName"
            label="Apellidos de contacto"
          />
          <v-text-field v-model="inputData.ContactPhone" label="Teléfono Particular" />
          <v-text-field
            v-model="inputData.ContactEmail"
            type="Email"
            label="Correo Electrónico"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="updateContact()">Aceptar</v-btn>
        <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

const props = defineProps({
    contact: Object
})
</script>
<script>
import { useAuthStore } from '~/store/auth';

export default {
  data() {
    return {
      dialog: false,
      inputData: {
        ContactName: "",
        ContactLastName: "",
        ContactDepartment: "",
        ContactPhone: "",
        ContactEmail: ""
      }
    };
  },
  methods: {
    async updateContact() {
        const Auth = useAuthStore()
        const options = Auth.defineOptions('PUT')
        options.body = this.inputData

        try {
            let response = $fetch(`/api/customer_contact/${contact.ContactId}`, options)
            this.dialog = false
            this.$emit('update-contact')
        } catch (error) {
            console.log(error)
        }
    }
  }
};
</script>

<style lang="scss" scoped></style>
