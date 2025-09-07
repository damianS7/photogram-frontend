// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Notification } from "@/types/Notification";
import { EventSourcePolyfill } from "event-source-polyfill";
import { notificationService } from "@/services/notificationService";
const API = import.meta.env.VITE_APP_API_URL;

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  // fetch the feed data for the given username
  async function getNotifications(): Promise<Notification[]> {
    return notifications.value;
  }

  async function initialize() {
    notifications.value = [];
    const eventSource = new EventSourcePolyfill(`${API}/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    eventSource.onmessage = (event: MessageEvent) => {
      // console.log("🔔 Notification received:", event.data);
      try {
        const notification: Notification = JSON.parse(event.data);
        if (typeof notification.message === "string") {
          // notifications.value.push(notification);
          notifications.value.unshift(notification);
        }
      } catch (error) {}
    };

    notificationService.fetchNotifications().then((fetchedNotifications) => {
      notifications.value = fetchedNotifications.content;
    });
  }

  async function clearNotifications() {
    notificationService.deleteNotifications().then(() => {
      notifications.value = [];
    });
  }

  async function refreshNotifications(): Promise<Notification[] | undefined> {
    return;
  }

  return {
    initialize,
    notifications,
    getNotifications,
    refreshNotifications,
    clearNotifications,
  };
});
