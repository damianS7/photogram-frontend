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
      const fFeed = (await feedService.getFeed(username)) as Feed;
      const resource = await customerService.getPhoto(fFeed.profileImageFilename);
      fFeed.profileImageFilename = URL.createObjectURL(resource);

      feed.value = fFeed;
      return feed.value;
    } catch (error) {
      console.error(error);
    }

    throw Error("Failed to fetch feed.");
  }

  return { feed, fetchFeed };
});
