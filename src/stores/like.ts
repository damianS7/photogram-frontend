// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { likeService } from "@/services/likeService";
import type { PostLikeData } from "@/types/PostLikeData";
export const useLikeStore = defineStore("like", () => {
  const likes = ref<PostLikeData>({
    postId: -1,
    hasBeenLiked: false,
    totalLikes: -1,
  } as PostLikeData);

  async function fetchLikes(postId: number): Promise<PostLikeData> {
    likes.value = await likeService.fetchLikeData(postId);
    return likes.value;
  }

  async function like(postId: number): Promise<void> {
    await likeService.like(postId);
    likes.value.hasBeenLiked = true;
    likes.value.totalLikes += 1;
  }

  async function unlike(postId: number) {
    await likeService.unlike(postId);
    likes.value.hasBeenLiked = false;
    likes.value.totalLikes -= 1;
  }

  return { fetchLikes, unlike, like, likes };
});
