// services/customerService.ts
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
    const response = await fetch(`${API}/feed/${username}`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch feed. " + json.message);
    }

    return await response.json();
  },
};
