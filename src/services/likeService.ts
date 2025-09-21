import { ApiError } from "@/types/ApiError";
import type { PostLikeData } from "@/types/PostLikeData";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const likeService = {
  async hasLike(postId: number): Promise<boolean> {
    const response = await fetch(`${API}/posts/${postId}/like`, {
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

  async fetchLikeData(postId: number): Promise<PostLikeData> {
    const response = await fetch(`${API}/posts/${postId}/likes`, {
      method: "GET",
      headers: authHeader(),
    });

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to fetch like data.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async like(postId: number): Promise<void> {
    const response = await fetch(`${API}/posts/${postId}/like`, {
      method: "POST",
      headers: authHeader(),
    });

    // json response
    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiError(json.message || "Failed to like post.", response.status, json.errors);
    }

    return json;
  },

  async unlike(postId: number): Promise<void> {
    const response = await fetch(`${API}/posts/${postId}/unlike`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiError(json.message || "Failed to unlike post.", response.status, json.errors);
    }
  },
};
