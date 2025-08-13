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
    const resource = await customerService.getPhoto(feed.value.profileImageFilename);
    feed.value.profileImageFilename = URL.createObjectURL(resource);

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
