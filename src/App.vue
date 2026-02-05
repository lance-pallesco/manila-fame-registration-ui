<script setup>
import { RouterView } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <v-app>
    <DefaultLayout>
      <RouterView />
    </DefaultLayout>
  </v-app>
</template>

<style></style>
