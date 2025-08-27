// stores/customerStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Follow } from "@/types/Follow";
import { followService } from "@/services/followService";
import { customerService } from "@/services/customerService";
import type { PaginatedResponse } from "@/types/PaginatedResponse";
export const useFollowStore = defineStore("follow", () => {
  const followers = ref<Follow[]>([]);
  const followersPagination = ref<PaginatedResponse>();
  const following = ref<Follow[]>([]);
  const followingPagination = ref<PaginatedResponse>();

  // fetch followers for the given customer by id
  async function fetchCustomerFollowers(customerId: number, page?: number) {
    const response = (await followService.getFollowers(customerId, page)) as PaginatedResponse;
    followersPagination.value = response;

    // if the page is not zero, append to existing array
    if (page && page > 0) {
      followers.value.push(...response.content);
    } else {
      // if page is undefined or zero, set the content to the followers array
      followers.value = response.content;
    }

    // for every follower ...
    for (const follower of followers.value) {
      // fetch the photo
      try {
        const resource = await customerService.getPhoto(follower.followerCustomerId);
        follower.followerCustomerProfileImageFilename = URL.createObjectURL(resource);
      } catch (error) {
        // TODO set dummy avatar from assets!
        // or just an icon ?
        follower.followerCustomerProfileImageFilename = "/public/avatar.jpg";
      }
    }
  }

  // fetch followings for the given customer by id
  async function fetchFollowingCustomers(customerId: number, page?: number) {
    const response = (await followService.getFollowing(customerId, page)) as PaginatedResponse;
    followingPagination.value = response;

    // if the page is not zero, append to existing array
    if (page && page > 0) {
      following.value.push(...response.content);
    } else {
      // if page is undefined or zero, set the content to the followers array
      following.value = response.content;
    }

    // for every following customer ...
    for (const followed of following.value) {
      // fetch the photo
      try {
        const resource = await customerService.getPhoto(followed.followedCustomerId);
        followed.followedCustomerProfileImageFilename = URL.createObjectURL(resource);
      } catch (error) {
        followed.followedCustomerProfileImageFilename = "/public/avatar.jpg";
      }
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
    followersPagination,
    following,
    followingPagination,
  };
});
