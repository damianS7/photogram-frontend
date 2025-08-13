// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Comment } from "@/types/Comment";
import { commentService } from "@/services/commentService";
import type { PaginatedResponse } from "@/types/PaginatedResponse";

export const useCommentStore = defineStore("comment", () => {
  const comments = ref<Comment[]>([]);
  const pagination = ref<PaginatedResponse>();

  // fetch the comments for the given post by id and specific page if provided
  async function fetchComments(postId: number, page?: number): Promise<Comment[]> {
    const paginatedPosts = (await commentService.getComments(postId, page)) as PaginatedResponse;
    pagination.value = paginatedPosts;

    // if the page is not zero, append to existing array
    if (page && page > 0) {
      comments.value.push(...paginatedPosts.content);
    } else {
      // if page is undefined or zero, set the content to the comments array
      comments.value = paginatedPosts.content;
    }

    return comments.value;
  }

  // add a new comment for the given post by id
  async function postComment(postId: number, comment: string) {
    const aComment = (await commentService.postComment(postId, comment)) as Comment;
    comments.value.unshift(aComment);
    return aComment;
  }

  // delete a comment by its id
  async function deleteComment(commentId: number) {
    await commentService.deleteComment(commentId);
    const index = comments.value.findIndex((comment) => comment.id === commentId);
    if (index !== -1) {
      comments.value.splice(index, 1);
    }
  }

  return { comments, deleteComment, postComment, fetchComments, pagination };
});
