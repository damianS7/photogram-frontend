// services/notificationService.ts
import { ApiError } from "@/types/ApiError";
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

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to fetch notifications.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async deleteNotifications() {
    const response = await fetch(`${API}/notifications`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to delete notifications.",
        response.status,
        json.errors
      );
    }
  },
};
