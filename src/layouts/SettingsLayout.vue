<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from "@/views/settings/components/Sidebar.vue";

onMounted(() => {});
</script>
<template>
  <div
    class="grid grid-cols-[auto_1fr] h-full w-full overflow-hidden rounded shadow border-2 border-gray-300"
  >
    <div>
      <Sidebar />
    </div>
    <div class="container w-full">
      <router-view />
    </div>
  </div>
</template>
