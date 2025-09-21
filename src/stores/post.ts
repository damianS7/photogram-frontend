// stores/usePostStore.ts
import { defineStore } from "pinia";
import { postService } from "@/services/postService";
import type { Post } from "@/types/Post";
import { ref } from "vue";
import type { PaginatedResponse } from "@/types/PaginatedResponse";

export const usePostStore = defineStore("post", () => {
  const posts = ref<Post[]>([]);
  const pagination = ref<PaginatedResponse>();

  async function fetchPosts(username: string, page?: number): Promise<Post[]> {
    const pPosts = (await postService.getPosts(username, page)) as PaginatedResponse;
    for (const post of pPosts.content as Post[]) {
      try {
        const resource = await postService.getPostPhoto(post.id);
        post.imageFilename = URL.createObjectURL(resource);
      } catch (error) {
        post.imageFilename = null;
      }
    }

    if (page && posts.value.length > 0) {
      pagination.value = pPosts;
      posts.value.push(...pPosts.content);
    } else {
      posts.value = pPosts.content;
    }
    return posts.value;
  }

  async function createPost(filename: string, description: string) {
    const post = (await postService.createPost(filename, description)) as Post;
    const resource = await postService.getPostPhoto(post.id);
    post.imageFilename = URL.createObjectURL(resource);
    posts.value.unshift(post);
    return post;
  }

  async function deletePost(postId: number) {
    await postService.deletePost(postId);
    const index = posts.value.findIndex((post) => post.id === postId);
    if (index !== -1) {
      posts.value.splice(index, 1);
    }
  }

  // upload the photo and returns filename
  async function uploadPostImage(file: File): Promise<string> {
    return await postService.uploadPostImage(file);
  }

  return {
    pagination,
    fetchPosts,
    posts,
    uploadPostImage,
    createPost,
    deletePost,
  };
});
