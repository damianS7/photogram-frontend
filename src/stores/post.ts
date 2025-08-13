// stores/customerStore.ts
import { defineStore } from "pinia";
import { postService } from "@/services/postService";
import type { Post } from "@/types/Post";
import { computed, ref } from "vue";
import type { PaginatedResponse } from "@/types/PaginatedResponse";

export const usePostStore = defineStore("post", () => {
  const posts = ref<Post[]>([]);
  const pagination = ref<PaginatedResponse>();

  async function fetchPosts(username: string, page?: number): Promise<Post[]> {
    const pPosts = (await postService.getPosts(username, page)) as PaginatedResponse;
    for (const post of pPosts.content as Post[]) {
      const resource = await postService.getPhoto(post.photoFilename);
      post.photoFilename = URL.createObjectURL(resource);
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
    const resource = await postService.getPhoto(post.photoFilename);
    post.photoFilename = URL.createObjectURL(resource);
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
  async function uploadPhoto(file: File): Promise<string> {
    return await postService.uploadPhoto(file);
  }

  return {
    pagination,
    fetchPosts,
    posts,
    uploadPhoto,
    createPost,
    deletePost,
  };
});
