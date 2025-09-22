// services/commentService.ts
import { ApiError } from "@/types/ApiError";
import type { Comment } from "@/types/Comment";
import type { PaginatedResponse } from "@/types/PaginatedResponse";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const commentService = {
  async fetchComments(postId: number, page?: number): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/posts/${postId}/comments?page=${page}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to fetch comments from post.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async postComment(postId: number, comment: string): Promise<Comment> {
    const response = await fetch(`${API}/posts/${postId}/comment`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ postId, comment }),
    });

    // json response
    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiError(
        json.message || "Failed to comment in post.",
        response.status,
        json.errors
      );
    }

    return json;
  },

  async deleteComment(commentId: number) {
    const response = await fetch(`${API}/comments/${commentId}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to delete comment from post.",
        response.status,
        json.errors
      );
    }
  },
};
