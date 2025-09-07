<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
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
  if (showNotifications.value) {
    window.addEventListener("click", () => {
      showNotifications.value = false;
    });
  }
}
onUnmounted(() => {
  window.removeEventListener("click", toggleNotifications);
});
</script>
<template>
  <span @click.stop class="relative">
    <span
      class="flex items-center p-1"
      :class="[showNotifications ? 'bg-gray-300 rounded-full' : '']"
    >
      <button @click="toggleNotifications">
        <Bell :size="26" />
        <span
          class="bg-red-600 rounded-full right-1 bottom-1 text-white absolute text-[0.5rem] w-3 h-3"
          >{{ unreadNotifications }}</span
        >
      </button>
    </span>
    <Notifications v-if="showNotifications" />
  </span>
</template>
