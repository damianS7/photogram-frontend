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

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to get likes. " + json.message);
    }

    return await response.json();
  },

  async like(postId: number): Promise<void> {
    const response = await fetch(`${API}/posts/${postId}/like`, {
      method: "POST",
      headers: authHeader(),
    });

    if (response.status !== 201) {
      const json = await response.json();
      throw new Error("Failed to like. " + json.message);
    }

    return await response.json();
  },

  async unlike(postId: number): Promise<void> {
    const response = await fetch(`${API}/posts/${postId}/unlike`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new Error("Failed to unlike. " + json.message);
    }
  },
};
