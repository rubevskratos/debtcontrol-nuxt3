<template>
  <v-app>
    <MainMenu v-if="isLoggedIn()"/>
    <v-container fluid style="margin-top:40px">
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