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

<script setup>
import { useAuthStore } from '@/store/auth';
import { useFetch } from '#app';

const auth = useAuthStore();

useFetch(async () => {
  await auth.initAuth();
});

const isLoggedIn = computed(() => auth.isLoggedIn);
</script>
