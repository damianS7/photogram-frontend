<script setup lang="ts">
import { useAppInit } from "@/composables/useAppInit";
import Sidebar from "@/views/settings/components/Sidebar.vue";
import Header from "@/components/Header.vue";
const appInit = useAppInit();
</script>
<template>
  <main v-if="appInit.isInitialized()" class="flex flex-col h-screen">
    <Header />
    <div class="p-6 h-full overflow-hidden">
      <div
        class="grid grid-cols-[auto_1fr] h-full w-full overflow-hidden rounded shadow border-2 border-gray-300"
      >
        <div>
          <Sidebar />
        </div>
        <div class="container w-full overflow-hidden">
          <router-view />
        </div>
      </div>
    </div>
  </main>
</template>
