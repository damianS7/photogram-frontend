// services/customerService.ts
import { ApiError } from "@/types/ApiError";
import type { Feed } from "@/types/Feed";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const feedService = {
  async getFeed(username: string): Promise<Feed> {
    const response = await fetch(`${API}/customers/${username}/feed`, {
      method: "GET",
      headers: authHeader(),
    });

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to fetch feed.", response.status, json.errors);
    }

    return json;
  },
};
