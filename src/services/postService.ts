import { ApiError } from "@/types/ApiError";
import type { ApiResponse } from "@/types/ApiResponse";
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
    const response = await fetch(`${API}/posts/image/${filename}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to get image.");
    }

    return await response.blob();
  },
  async getPostPhoto(postId: number): Promise<Blob> {
    const response = await fetch(`${API}/posts/${postId}/image`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to get image.");
    }

    return await response.blob();
  },

  async createPost(imageFilename: string, description: string): Promise<Post> {
    const response = await fetch(`${API}/posts`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ imageFilename, description }),
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

  async uploadPostImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API}/posts/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    // json response
    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiError(json.message || "Failed to upload image.", response.status, json.errors);
    }

    return json.imageFilename;
  },
};
