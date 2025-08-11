// services/commentService.ts
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
  async getComments(postId: number, page?: number): Promise<PaginatedResponse> {
    const response = await fetch(
      `${API}/posts/${postId}/comments?page=${page}&sort=createdAt,DESC`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error("Failed to fetch comments. " + json.message);
    }

    return await response.json();
  },

  async postComment(postId: number, comment: string): Promise<Comment> {
    const response = await fetch(`${API}/posts/${postId}/comments`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ postId, comment }),
    });

    if (response.status !== 201) {
      throw new Error("Failed to create a comment.");
    }

    return await response.json();
  },

  async deleteComment(commentId: number) {
    const response = await fetch(`${API}/comments/${commentId}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete comment.");
    }
  },
};
