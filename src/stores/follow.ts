// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Follow } from "@/types/Follow";
import { followService } from "@/services/followService";
import { customerService } from "@/services/customerService";
export const useFollowStore = defineStore("follow", () => {
  const followers = ref<Follow[]>([]);
  const following = ref<Follow[]>([]);

  async function fetchFollows(customerId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw Error("Token not found.");
    }

    try {
      followers.value = (await followService.getFollowers(customerId)) as Follow[];
      for (const follower of followers.value) {
        const resource = await customerService.getPhoto(
          follower.followerCustomerProfileImageFilename
        );
        follower.followerCustomerProfileImageFilename = URL.createObjectURL(resource);
      }
      following.value = (await followService.getFollowing(customerId)) as Follow[];
      for (const followed of following.value) {
        const resource = await customerService.getPhoto(
          followed.followedCustomerProfileImageFilename
        );
        followed.followedCustomerProfileImageFilename = URL.createObjectURL(resource);
      }
    } catch (error) {
      console.error(error);
    }

    throw Error("Failed to fetch follows.");
  }

  async function fetchFollowers(customerId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw Error("Token not found.");
    }

    try {
      followers.value = (await followService.getFollowers(customerId)) as Follow[];
      for (const follower of followers.value) {
        const resource = await customerService.getPhoto(
          follower.followerCustomerProfileImageFilename
        );
        follower.followerCustomerProfileImageFilename = URL.createObjectURL(resource);
      }
    } catch (error) {
      console.error(error);
    }

    throw Error("Failed to fetch followers.");
  }

  async function fetchFollowings(customerId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw Error("Token not found.");
    }

    try {
      following.value = (await followService.getFollowing(customerId)) as Follow[];
      for (const followed of following.value) {
        const resource = await customerService.getPhoto(
          followed.followedCustomerProfileImageFilename
        );
        followed.followedCustomerProfileImageFilename = URL.createObjectURL(resource);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function follow(customerId: number): Promise<Follow> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw Error("Token not found.");
    }

    return await followService.follow(customerId).then((follow) => {
      followers.value.push(follow);
      return follow;
    });
  }

  async function unfollow(customerId: number) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw Error("Token not found.");
    }

    try {
      await followService.unfollow(customerId).then(() => {
        const index = following.value.findIndex(
          (follow) => follow.followedCustomerId === customerId
        );
        if (index !== -1) {
          following.value.splice(index, 1);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  return { follow, unfollow, fetchFollows, fetchFollowers, fetchFollowings, followers, following };
});
