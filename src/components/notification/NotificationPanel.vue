<script setup lang="ts">
import { useNotificationStore } from "@/stores/notification";
import { storeToRefs } from "pinia";

// stores
const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);
</script>
<template>
  <div
    class="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-300 border border-dashed border-black p-2 w-60 rounded-md shadow-md z-50 overflow-hidden"
  >
    <div class="overflow-x-hidden overflow-y-auto h-40 w-full">
      <slot v-for="notification in notifications">
        <p class="w-full">
          <span>{{ notification.id }}</span>
          <span class="truncate">{{ notification.content }}</span>
        </p>
      </slot>
    </div>
    <span class="flex justify-end">
      <button class="btn btn-sm btn-blue" @click="notificationStore.clearNotifications()">
        Clear
      </button>
    </span>
  </div>
</template>
