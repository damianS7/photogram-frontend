<script setup lang="ts">
defineProps<{
  to: string;
  icon?: unknown;
  label: string;
}>();
</script>

<template>
  <RouterLink v-slot="{ isActive }" :to="to">
    <div
      :class="[
        'flex items-center gap-4 p-2 rounded transition-colors',
        isActive ? 'bg-gray-200' : 'hover:bg-gray-200',
      ]"
    >
      <span class="text-lg">
        <component :is="icon" class="w-6 h-6" />
      </span>
      <span
        class="sidebar-label overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:opacity-100 opacity-0"
        >{{ label }}</span
      >
    </div>
  </RouterLink>
</template>
