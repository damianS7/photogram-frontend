<script setup lang="ts">
defineProps({
  size: {
    type: Number,
    default: 2,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="flex justify-center items-center h-full w-full">
    <div
      :class="size ? `h-${size} w-${size}` : 'h-2 w-2'"
      class="animate-spin rounded-full border-t-2 border-blue-500 border-solid"
    ></div>
  </div>
</template>
