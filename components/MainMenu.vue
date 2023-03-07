<template>
  <v-app-bar app fixed dark elevation="4">
    <v-btn icon @click="$router.push('/')"><v-icon>mdi-home</v-icon></v-btn>
    <v-btn text @click="$router.push('/customers')">Clientes</v-btn>
    <v-btn text>Facturas</v-btn>
    <v-spacer />
    <v-btn text disabled>{{ user.name }}</v-btn>

    <!-- <v-btn icon v-if="this.$auth.user.Admin" @click="$router.push('/admin')"
      ><v-icon>mdi-cog</v-icon></v-btn
    > -->
    <v-btn rounded icon="mdi-logout" variant="tonal" @click="logout" />
  </v-app-bar>
</template>

<script>
import { useAuthStore } from '@/store/auth'


export default {
  data() {
    return {
      user: "", 
    };
  },
  methods: {
    async logout() {
         const auth = useAuthStore()
         
         try {
             let response = await auth.logOut()
             this.$router.push('/login')
         } catch (error) {
             console.log(error)
         }
    }
  },
};
</script>
