<template>
  <v-card v-for="(contact, i) in contacts" key="i">
    <v-card-title> CONTACTO </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col> Persona de Contacto: {{ contact.ContactName }} {{ contact.ContactLastName }} </v-col>
          <v-col> Departamento: {{ contact.ContactDepartment }} </v-col>
        </v-row>
        <v-row>
          <v-col> Teléfono Particular: {{ contact.ContactPhone }} </v-col>
          <v-col> Correo Electrónico: {{ contact.ContactEmail }} </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <EditContactComponent :contact="contact" @update-contact="refreshContacts()" />
      <v-btn color="red" @click.native="deleteContact(contact.ContactId)"><v-icon>mdi-delete-forever</v-icon> Eliminar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  customer: Object
})
</script>
<script>
import { useAuthStore } from '@/store/auth';

export default {
  data() {
    return {
      contacts: reactive([])
    }
  },
  emits: ['delete-contact'],
  mounted: async function() {
    try {
      let response = await this.refreshContacts()
    } catch (error) {
      console.log(error)
    }  
  },
  methods: {
    async refreshContacts() {
      const auth = useAuthStore()
      const options = auth.defineOptions('GET')

      try {
        let response = await $fetch(`/api/customer_contact/${this.customer.CustomerId}`, options)
        this.contacts = response
      } catch (error) {
        console.log(error) 
      }
    },
    async deleteContact(id) {
      const Auth = useAuthStore()
      const options = Auth.defineOptions('DELETE')
      try {
        let response = await $fetch(`/api/customer_contact/${id}`, options)
        this.$emit('delete-contact')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
