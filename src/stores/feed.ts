// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Feed } from "@/types/Feed";
import { feedService } from "@/services/feedService";
import { customerService } from "@/services/customerService";

export const useFeedStore = defineStore("feed", () => {
  const feed = ref<Feed>();

  async function fetchFeed(username: string): Promise<Feed> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw Error("Token not found.");
    }

    try {
      feed.value = await feedService.getFeed(username);
      const resource = await customerService.getPhoto(feed.value.profileImageFilename);
      feed.value.profileImageFilename = URL.createObjectURL(resource);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return feed.value;
  }

  async function refreshFeed(): Promise<Feed | undefined> {
    if (!feed.value) {
      return;
    }

    return await fetchFeed(feed.value.username);
  }

  async function updateFeed(fields: {
    totalPosts?: number;
    followers?: number;
    following?: number;
  }) {
    if (!feed.value) {
      return;
    }
    // const followerCount = feedStore.feed?.followers as number;
    // if (typeof followerCount !== "number") {
    //   return;
    // }

    if (typeof fields.followers === "number") {
      feed.value.followers += fields.followers;
    }

    if (typeof fields.totalPosts === "number") {
      feed.value.totalPosts += fields.totalPosts;
    }

    if (typeof fields.following === "number") {
      feed.value.following += fields.following;
    }
  }

  return { feed, fetchFeed, updateFeed };
});
