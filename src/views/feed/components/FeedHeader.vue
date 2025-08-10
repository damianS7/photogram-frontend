<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import FollowButton from "../follow/components/FollowButton.vue";
import type { Feed } from "@/types/Feed";
import { useModalStore } from "@/stores/modal";
const props = defineProps<{
  feed: Feed;
}>();

function isLoggedUserFeed() {
  const loggedUserCustomerId = useCustomerStore().customer.id;

  return loggedUserCustomerId === props.feed.customerId ? true : false;
}

const modalStore = useModalStore();
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
        class="rounded-full max-w-32 bg-gray-300"
      />
    </div>

    <!-- col 2 -->
    <div class="flex flex-col justify-center gap-2">
      <div class="flex items-center gap-2">
        <b class="uppercase">@{{ feed.username }}</b>
        <div v-if="!isLoggedUserFeed()" class="flex items-center gap-2">
          <FollowButton :customer-id="feed.customerId" />
          <button class="btn btn-sm btn-primary">Send message</button>
        </div>
      </div>
      <div class="flex items-center gap-2 text-gray-600">
        <span
          >Posts: <b>{{ feed.totalPosts }}</b>
        </span>
        <slot v-if="isLoggedUserFeed()">
          <span>
            <a @click="showFollowers" href="#"
              >Followers:&nbsp;<b>{{ feed.followers }}</b>
            </a>
          </span>
          <span>
            <a @click="showFollowing" href="#"
              >Following:&nbsp;<b>{{ feed.following }}</b>
            </a>
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
