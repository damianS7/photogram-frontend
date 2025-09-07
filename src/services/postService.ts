import type { JsonResponse } from "@/types/JsonResponse";
import type { PaginatedResponse } from "@/types/PaginatedResponse";
import type { Post } from "@/types/Post";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const postService = {
  async getPosts(username: string, page?: number): Promise<PaginatedResponse> {
    const response = await fetch(`${API}/posts/${username}?page=${page}&sort=createdAt,DESC`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch posts. " + json.message);
    }

    return await response.json();
  },
  async getPhoto(filename: string): Promise<Blob> {
    const response = await fetch(`${API}/posts/photo/${filename}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to get photo.");
    }

    return await response.blob();
  },
  async getPostPhoto(postId: number): Promise<Blob> {
    const response = await fetch(`${API}/posts/${postId}/photo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to get photo.");
    }

    return await response.blob();
  },

  async createPost(photoFilename: string, description: string): Promise<Post> {
    const response = await fetch(`${API}/posts`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ photoFilename, description }),
    });

    if (response.status !== 201) {
      throw new Error("Failed to create a post.");
    }

    return await response.json();
  },

  async deletePost(postId: number) {
    const response = await fetch(`${API}/posts/${postId}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete post.");
    }
  },

  async uploadPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API}/posts/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.status !== 201) {
      const r = (await response.json()) as JsonResponse;
      throw new Error(r.message || "Failed to upload photo.");
    }

    const json = await response.json();

    return json.photoFilename;
  },
};
