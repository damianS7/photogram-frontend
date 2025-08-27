// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Feed } from "@/types/Feed";
import { feedService } from "@/services/feedService";
import { customerService } from "@/services/customerService";

export const useFeedStore = defineStore("feed", () => {
  const feed = ref<Feed>();

  // fetch the feed data for the given username
  async function fetchFeed(username: string): Promise<Feed> {
    feed.value = await feedService.getFeed(username);

    // get the photo profile
    try {
      const resource = await customerService.getPhoto(feed.value.customerId);
      feed.value.profileImageFilename = URL.createObjectURL(resource);
    } catch (error) {
      feed.value.profileImageFilename = "/public/avatar.jpg";
    }

    return feed.value;
  }

  async function refreshFeed(): Promise<Feed | undefined> {
    if (!feed.value) {
      return;
    }

    return await fetchFeed(feed.value.username);
  }

  return { feed, fetchFeed, refreshFeed };
});
