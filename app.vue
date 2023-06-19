<template>
  <v-app>
    <MainMenu v-if="isLoggedIn"/>
    <v-container v-if="!isLoggedIn" fluid class="fill-height ma-0 pa-0">
      <NuxtPage />
    </v-container>
    <v-container v-else fluid class="overflow-hidden">
      <NuxtPage class="mt-8"/>
    </v-container>
  </v-app>
</template>

<script>  
import { useAuthStore  } from '@/store/auth';

export default {
  data() {
    return reactive({
      isLoggedIn: false
    })
  },
  mounted() {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      const auth = useAuthStore()
      this.isLoggedIn = auth.isLoggedIn
    }
  }
}
</script>