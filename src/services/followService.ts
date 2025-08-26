import type { Follow } from "@/types/Follow";
import type { PaginatedResponse } from "@/types/PaginatedResponse";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const followService = {
  // get followers for the given customer by id
  async getFollowers(customerId: number, page?: number): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/customers/${customerId}/followers?page=${page}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch followers. " + json.message);
    }

    return await response.json();
  },

  // get following for the given customer by id
  async getFollowing(customerId: number, page?: number): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/customers/${customerId}/following?page=${page}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch followings. " + json.message);
    }

    return await response.json();
  },

  // get the follow relation between logged customer and the customer passed id
  async getFollow(customerId: number): Promise<Follow | undefined> {
    const response = await fetch(`${API}/customers/${customerId}/follow`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch follow relation. " + json.message);
    }

    return await response.json();
  },

  // follow customer by id
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

  // unfollow customer by id
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
