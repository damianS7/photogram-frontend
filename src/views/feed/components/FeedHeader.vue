<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import type { Feed } from "@/types/Feed";
const props = defineProps<{
  feed: Feed;
}>();

function isLoggedUserFeed() {
  const loggedUserCustomerId = useCustomerStore().customer.id;

  return loggedUserCustomerId === props.feed.customerId ? true : false;
}
</script>
<template>
  <div class="flex sm:max-w-xl p-2 gap-4 mx-auto">
    <!-- Columna 1: Foto -->
    <div class="">
      <img
        :src="feed.profileImageFilename"
        alt="Profile photo"
        class="rounded-full max-w-32 bg-gray-300"
      />
    </div>

    <!-- Columna 2: 3 filas -->
    <div class="flex flex-col justify-center gap-2">
      <div class="flex items-center gap-2">
        <b class="uppercase">@{{ feed.username }}</b>
        <div class="flex items-center gap-2" v-if="!isLoggedUserFeed()">
          <button class="btn btn-sm btn-primary">Follow</button>
          <button class="btn btn-sm btn-primary">Send message</button>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-gray-500"
          >Posts:

          <b>{{ feed.totalPosts }}</b>
        </span>
        <span class="text-gray-500"
          >Followers:
          <b>{{ feed.followers }}</b>
        </span>
        <span class="text-gray-500"
          >Follows:
          <b>{{ feed.followed }}</b>
        </span>
      </div>
      <div class="flex items-center gap-4 text-xs text-gray-400">
        <p>
          {{ feed.aboutMe }}
        </p>
      </div>
    </div>
  </div>
</template>
