// stores/customerStore.ts
import { defineStore } from "pinia";
import { postService } from "@/services/postService";
import type { Post } from "@/types/Post";
import { computed, ref, type Ref } from "vue";

export const usePostStore = defineStore("post", () => {
  const customerId = 0;
  const posts = ref<Post[]>([]);

  // getters
  const getPosts = computed(() => posts.value);
  const getPost = computed(() => (id: number) => {
    return posts.value.forEach((post) => {
      return post.id === id;
    });
  });

  async function fetchPosts(username: string): Promise<Post[]> {
    const token = localStorage.getItem("token");
    if (!token) return posts.value;

    try {
      const fPosts = (await postService.getPosts(username)) as Post[];
      for (const post of fPosts) {
        const resource = await postService.getPhoto(post.photoFilename);
        post.photoFilename = URL.createObjectURL(resource);
      }

      posts.value = fPosts;
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

  return { getPosts, fetchPosts, posts, customerId, uploadPhoto, createPost, deletePost };
});
