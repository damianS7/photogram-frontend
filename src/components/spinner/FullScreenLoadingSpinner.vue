<script setup lang="ts">
import { useSpinnerStore } from "@/stores/spinner";
const spinner = useSpinnerStore();
</script>
<template>
  <div
    v-if="spinner.isVisible"
    class="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center"
  >
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
  </div>
</template>
