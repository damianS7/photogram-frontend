import { ApiError } from "@/types/ApiError";
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

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to fetch followers from customer.",
        response.status,
        json.errors
      );
    }

    return json;
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

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to fetch following from customer.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  // get the follow relation between logged customer and the customer passed id
  async getFollow(customerId: number): Promise<Follow | undefined> {
    const response = await fetch(`${API}/customers/${customerId}/follow`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to fetch follow.", response.status, json.errors);
    }

    return json;
  },

  // follow customer by id
  async follow(customerId: number): Promise<Follow> {
    const response = await fetch(`${API}/customers/${customerId}/follow`, {
      method: "POST",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiError(
        json.message || "Failed to follow customer.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  // unfollow customer by id
  async unfollow(customerId: number) {
    const response = await fetch(`${API}/customers/${customerId}/unfollow`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to unfollow customer.",
        response.status,
        json.errors
      );
    }
  },
};
