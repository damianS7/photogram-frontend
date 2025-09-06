<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import FollowButton from "@/components/follow/FollowButton.vue";
import type { Feed } from "@/types/Feed";
import { useModalStore } from "@/stores/modal";
import { authUtils } from "@/utils/auth";
const { isCurrentUserOwner } = authUtils();

// props
defineProps<{
  feed: Feed;
}>();

// store
const modalStore = useModalStore();

// functions
async function showFollowers() {
  await modalStore.open("FollowersList", {
    customerId: useCustomerStore().customer.id,
  });
}

async function showFollowing() {
  await modalStore.open("FollowedList", {
    customerId: useCustomerStore().customer.id,
  });
}
</script>
<template>
  <div class="flex sm:max-w-xl p-2 gap-4 mx-auto">
    <!-- col 1 -->
    <div class="">
      <img
        :src="feed.profileImageFilename"
        alt="Profile photo"
        class="rounded-full object-cover h-24 w-24 bg-gray-300"
      />
    </div>

    <!-- col 2 -->
    <div class="flex flex-col justify-center gap-2">
      <div class="flex items-center gap-2">
        <b class="uppercase">@{{ feed.username }}</b>
        <div v-if="!isCurrentUserOwner(feed.customerId)" class="flex items-center gap-2">
          <FollowButton :customer-id="feed.customerId" />
          <button class="btn btn-sm btn-primary">Send message</button>
        </div>
      </div>
      <div class="flex items-center gap-2 text-gray-600">
        <span
          >Posts: <b>{{ feed.totalPosts }}</b>
        </span>
        <slot v-if="isCurrentUserOwner(feed.customerId)">
          <span>
            <button
              class="btn btn-sm bg-gray-200 hover:bg-gray-300"
              @click="showFollowers"
              href="#"
            >
              Followers:&nbsp;<b>{{ feed.followers }}</b>
            </button>
          </span>
          <span>
            <button
              class="btn btn-sm bg-gray-200 hover:bg-gray-300"
              @click="showFollowing"
              href="#"
            >
              Following:&nbsp;<b>{{ feed.following }}</b>
            </button>
          </span>
        </slot>
        <slot v-else>
          <span
            >Followers:&nbsp;<b>{{ feed.followers }}</b>
          </span>
          <span
            >Following:&nbsp;<b>{{ feed.following }}</b>
          </span>
        </slot>
      </div>
      <div class="flex items-center gap-4 text-xs text-gray-400">
        <p>
          {{ feed.aboutMe }}
        </p>
      </div>
    </div>
  </div>
</template>
