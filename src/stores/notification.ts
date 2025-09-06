// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Notification } from "@/types/Notification";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  // fetch the feed data for the given username
  async function fetchNotifications(): Promise<Notification[]> {
    // const eventSource = new EventSource("http://localhost:8080/notifications/stream");
    // eventSource.onmessage = (event) => {
    //   console.log("🔔 Notificación:", event.data);
    //   // aquí actualizas tu store o muestras un toast
    // };

    // eventSource.onerror = (err) => {
    //   console.error("SSE error:", err);
    // };
    notifications.value = [
      {
        id: 1,
        postId: 101,
        content: "New comment on your post!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        postId: 102,
        content: "Your post got a new like!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        postId: 103,
        content: "You have a new follower!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        postId: 103,
        content: "You have a new follower!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        postId: 103,
        content: "You have a new follower!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        postId: 103,
        content: "You have a new follower sdfsdfsdf sdfsdfsdf sfsdfsdf!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        postId: 103,
        content: "You have a new followerfollowerfollowerfollowerfollowerfollower!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        postId: 103,
        content: "You have a new follower!",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        postId: 103,
        content: "You have a new follower!",
        createdAt: new Date().toISOString(),
      },
    ];

    return notifications.value;
  }

  async function initialize() {
    await fetchNotifications();
  }

  async function clearNotifications() {
    notifications.value = [];
  }

  async function refreshNotifications(): Promise<Notification[] | undefined> {
    return;
  }

  return {
    initialize,
    notifications,
    fetchNotifications,
    refreshNotifications,
    clearNotifications,
  };
});
