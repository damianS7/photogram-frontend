// stores/customerStore.ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Comment } from "@/types/Comment";
import { commentService } from "@/services/commentService";

export const useCommentStore = defineStore("comment", () => {
  const comments = ref<Comment[]>([]); // record id comment

  // getters
  const getComments = computed(() => (postId: number) => {
    return comments.value.filter((comment: Comment) => {
      return comment.postId === postId;
    });
  });

  async function fetchComments(postId: number): Promise<Comment[]> {
    const token = localStorage.getItem("token");
    if (!token) return comments.value;

    try {
      const fPosts = (await commentService.getComments(postId)) as Comment[];

      comments.value = fPosts;
    } catch (error) {
      console.error(error);
    }
    return comments.value;
  }

  async function postComment(postId: number, comment: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const aComment = (await commentService.postComment(postId, comment)) as Comment;
      comments.value.push(aComment);
      return aComment;
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteComment(commentId: number) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await commentService.deleteComment(commentId);
      const index = comments.value.findIndex((comment) => comment.id === commentId);
      if (index !== -1) {
        comments.value.splice(index, 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return { comments, deleteComment, postComment, fetchComments, getComments };
});
