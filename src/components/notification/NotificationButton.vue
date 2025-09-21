<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { ref } from "vue";
import { Bell } from "lucide-vue-next";
import Notifications from "@/components/notification/NotificationPanel.vue";

// stores
const notificationStore = useNotificationStore();
const showNotifications = ref(false);
const unreadNotifications = computed(() => notificationStore.countNotifications());

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
  <span @click.stop>
    <span
      class="flex items-center p-1"
      :class="[showNotifications ? 'bg-gray-300 rounded-full' : '']"
    >
      <button class="relative" @click="toggleNotifications">
        <Bell :size="26" />
        <span
          class="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] leading-none font-semibold shadow-sm pointer-events-none"
        >
          {{ unreadNotifications }}
        </span>
      </button>
    </span>
    <span class="relative">
      <Notifications v-if="showNotifications" />
    </span>
  </span>
</template>
