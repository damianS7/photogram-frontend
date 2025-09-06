<script setup lang="ts">
import { useAppInit } from "@/composables/useAppInit";
import Header from "@/components/Header.vue";
const appInit = useAppInit();
</script>
<template>
  <main v-if="appInit.isInitialized()" class="flex flex-col">
    <Header />
    <div class="p-6 h-full">
      <router-view />
    </div>
  </main>
</template>
