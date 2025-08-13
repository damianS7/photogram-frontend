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
    followers.value = (await followService.getFollowers(customerId)) as Follow[];

    // for every follower ...
    for (const follower of followers.value) {
      const imageFilename = follower.followerCustomerProfileImageFilename;
      // fetch the photo
      const resource = await customerService.getPhoto(imageFilename);
      follower.followerCustomerProfileImageFilename = URL.createObjectURL(resource);
    }
  }

  // fetch followings for the given customer by id
  async function fetchFollowingCustomers(customerId: number) {
    following.value = (await followService.getFollowing(customerId)) as Follow[];

    // for every following customer ...
    for (const followed of following.value) {
      const imageFilename = followed.followedCustomerProfileImageFilename;
      // fetch the photo
      const resource = await customerService.getPhoto(imageFilename);
      followed.followedCustomerProfileImageFilename = URL.createObjectURL(resource);
    }
  }

  // follow the given customer by id
  async function follow(customerId: number): Promise<Follow> {
    const follow = await followService.follow(customerId);
    followers.value.push(follow);
    return follow;
  }

  // unfollow the given customer by id
  async function unfollow(customerId: number) {
    await followService.unfollow(customerId);

    const index = following.value.findIndex((follow) => follow.followedCustomerId === customerId);
    if (index !== -1) {
      following.value.splice(index, 1);
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
