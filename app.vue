<template>
  <v-app>
    <MainMenu v-if="isLoggedIn()"/>
    <v-container fluid class="fill-height mt-5">
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