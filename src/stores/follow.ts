// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Follow } from "@/types/Follow";
import { followService } from "@/services/followService";
import { customerService } from "@/services/customerService";
export const useFollowStore = defineStore("follow", () => {
  const followers = ref<Follow[]>([]);
  const following = ref<Follow[]>([]);

  // fetch followers for the given customer by id
  async function fetchCustomerFollowers(customerId: number) {
    try {
      followers.value = (await followService.getFollowers(customerId)) as Follow[];
    } catch (error) {
      console.error("Failed to fetch followers.");
      throw error;
    }

    // for every follower ...
    for (const follower of followers.value) {
      const imageFilename = follower.followerCustomerProfileImageFilename;
      try {
        // fetch the photo
        const resource = await customerService.getPhoto(imageFilename);
        follower.followerCustomerProfileImageFilename = URL.createObjectURL(resource);
      } catch (error) {
        throw error;
      }
    }
  }

  // fetch followings for the given customer by id
  async function fetchFollowingCustomers(customerId: number) {
    try {
      following.value = (await followService.getFollowing(customerId)) as Follow[];
    } catch (error) {
      throw error;
    }

    // for every following customer ...
    for (const followed of following.value) {
      const imageFilename = followed.followedCustomerProfileImageFilename;
      try {
        // fetch the photo
        const resource = await customerService.getPhoto(imageFilename);
        followed.followedCustomerProfileImageFilename = URL.createObjectURL(resource);
      } catch (error) {
        throw error;
      }
    }
  }

  // follow the given customer by id
  async function follow(customerId: number): Promise<Follow> {
    try {
      const follow = await followService.follow(customerId);
      followers.value.push(follow);
      return follow;
    } catch (error) {
      throw error;
    }
  }

  // unfollow the given customer by id
  async function unfollow(customerId: number) {
    try {
      await followService.unfollow(customerId);

      const index = following.value.findIndex((follow) => follow.followedCustomerId === customerId);
      if (index !== -1) {
        following.value.splice(index, 1);
      }
    } catch (error) {
      throw error;
    }
  }

  return {
    follow,
    unfollow,
    fetchCustomerFollowers,
    fetchFollowingCustomers,
    followers,
    following,
  };
});
