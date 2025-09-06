<script setup lang="ts">
import { computed } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { ref } from "vue";
import { Bell } from "lucide-vue-next";
import Notifications from "@/components/notification/NotificationPanel.vue";

// stores
const notificationStore = useNotificationStore();
const showNotifications = ref(false);
const unreadNotifications = computed(() => notificationStore.notifications.length);

// functions
function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
}
</script>
<template>
  <span
    class="relative flex items-center p-1"
    :class="[showNotifications ? 'bg-gray-300 rounded-full' : '']"
  >
    <button @click="toggleNotifications">
      <Bell class="relative" :size="26" />
      <span
        class="bg-red-600 rounded-full right-1 bottom-1 text-white absolute text-[10px] w-3 h-3"
        >{{ unreadNotifications }}</span
      >
    </button>
    <Notifications v-if="showNotifications" />
  </span>
</template>
