// services/notificationService.ts
import type { PaginatedResponse } from "@/types/PaginatedResponse";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const notificationService = {
  async fetchNotifications(page?: number): Promise<PaginatedResponse> {
    const response = await fetch(`${API}/notifications?page=${page}&sort=createdAt,DESC`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch notifications. " + json.message);
    }

    return await response.json();
  },
  async deleteNotifications() {
    const response = await fetch(`${API}/notifications`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete notifications.");
    }
  },
};
