import type { Follow } from "@/types/Follow";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const followService = {
  async isFollowing(customerId: number): Promise<boolean> {
    const response = await fetch(`${API}/customers/${customerId}/checkFollowing`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      // const json = await response.json();
      // throw new Error("Failed to fetch follows. " + json.message);
      return false;
    }

    return true;
  },

  async getFollowers(customerId: number): Promise<Follow[]> {
    const response = await fetch(`${API}/customers/${customerId}/followers`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch follows. " + json.message);
    }

    return await response.json();
  },

  async getFollowing(customerId: number): Promise<Follow[]> {
    const response = await fetch(`${API}/customers/${customerId}/following`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch follows. " + json.message);
    }

    return await response.json();
  },

  async follow(customerId: number): Promise<Follow> {
    const response = await fetch(`${API}/customers/${customerId}/follow`, {
      method: "POST",
      headers: authHeader(),
    });

    if (response.status !== 201) {
      const json = await response.json();
      throw new Error("Failed to follow. " + json.message);
    }

    return (await response.json()) as Follow;
  },

  async unfollow(customerId: number) {
    const response = await fetch(`${API}/customers/${customerId}/unfollow`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new Error("Failed to unfollow. " + json.message);
    }
  },
};
