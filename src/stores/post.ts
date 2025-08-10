// stores/customerStore.ts
import { defineStore } from "pinia";
import { postService } from "@/services/postService";
import type { Post } from "@/types/Post";
import { computed, ref, type Ref } from "vue";
import type { Pagination } from "@/types/Pagination";

export const usePostStore = defineStore("post", () => {
  const customerId = 0;
  const posts = ref<Post[]>([]);
  const pagination = ref<Pagination>();

  // getters
  const getPosts = computed(() => posts.value);
  const getPost = computed(() => (id: number) => {
    return posts.value.forEach((post) => {
      return post.id === id;
    });
  });

  async function fetchPosts(username: string, page?: number): Promise<Post[]> {
    const token = localStorage.getItem("token");
    if (!token) return posts.value;

    try {
      const pPosts = (await postService.getPosts(username, page)) as Pagination;
      for (const post of pPosts.content as Post[]) {
        const resource = await postService.getPhoto(post.photoFilename);
        post.photoFilename = URL.createObjectURL(resource);
      }

      if (posts.value.length > 0) {
        pagination.value = pPosts;
        posts.value.push(...pPosts.content);
      } else {
        posts.value = pPosts.content;
      }
    } catch (error) {
      console.error(error);
    }
    return posts.value;
  }

  async function createPost(filename: string, description: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const post = (await postService.createPost(filename, description)) as Post;
      const resource = await postService.getPhoto(post.photoFilename);
      post.photoFilename = URL.createObjectURL(resource);
      posts.value.push(post);
      return post;
    } catch (error) {
      console.error(error);
    }
  }

  async function deletePost(postId: number) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await postService.deletePost(postId);
      const index = posts.value.findIndex((post) => post.id === postId);
      if (index !== -1) {
        posts.value.splice(index, 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadPhoto(file: File) {
    const imageFilename = await postService.uploadPhoto(file);
    return imageFilename;
  }

  return {
    pagination,
    getPosts,
    fetchPosts,
    posts,
    customerId,
    uploadPhoto,
    createPost,
    deletePost,
  };
});
