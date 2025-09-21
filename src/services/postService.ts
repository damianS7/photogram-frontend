import { ApiError } from "@/types/ApiError";
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

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to fetch posts.", response.status, json.errors);
    }

    return json;
  },
  // async getPostImage(filename: string): Promise<Blob> {
  //   const response = await fetch(`${API}/posts/image/${filename}`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   });

  //   if (response.status !== 200) {
  //     const json = await response.json();
  //     throw new ApiError(
  //       json.message || "Failed to fetch post image.",
  //       response.status,
  //       json.errors
  //     );
  //   }

  //   return await response.blob();
  // },
  async getPostImage(postId: number): Promise<Blob> {
    const response = await fetch(`${API}/posts/${postId}/image`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to fetch post image.",
        response.status,
        json.errors
      );
    }

    return await response.blob();
  },

  async createPost(imageFilename: string, description: string): Promise<Post> {
    const response = await fetch(`${API}/posts`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ imageFilename, description }),
    });

    // json response
    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiError(json.message || "Failed to create post.", response.status, json.errors);
    }

    return json;
  },

  async deletePost(postId: number) {
    const response = await fetch(`${API}/posts/${postId}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    // json response
    const json = await response.json();

    if (response.status !== 204) {
      throw new ApiError(json.message || "Failed to delete post.", response.status, json.errors);
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
