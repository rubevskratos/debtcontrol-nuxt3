<template>
  <v-app>
    <MainMenu v-if="isLoggedIn()"/>
    <v-container fluid style="height:100%;margin:0%;padding:0%">
      <NuxtPage />
    </v-container>
  </v-app>
</template>

<script>
import { useAuthStore  } from '@/store/auth';

export default {
  methods: {
    isLoggedIn () {
      const auth = useAuthStore()
      return auth.isLoggedIn
    }
  }
}

</script>