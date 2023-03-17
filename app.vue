<template>
  <v-app>
    <MainMenu v-if="isLoggedIn()"/>
    <v-container v-if="!isLoggedIn()" fluid class="fill-height ma-0 pa-0">
      <NuxtPage />
    </v-container>
    <v-container v-else fluid class="fill-height overflow-hidden">
      <NuxtPage class="mt-8"/>
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