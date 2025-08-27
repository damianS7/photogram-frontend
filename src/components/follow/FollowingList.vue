<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { useFollowStore } from "@/stores/follow";
import { useModalStore } from "@/stores/modal";
import FollowButton from "./FollowButton.vue";
import type { Follow } from "@/types/Follow";
import { useScrollBottonDetect } from "@/composables/useScrollBottomDetect";

// props
const props = defineProps<{
  customerId: number;
}>();

// store
const followStore = useFollowStore();
const modalStore = useModalStore();

// data
const page = ref(0);
const followed = computed(() => followStore.following as Follow[]);

const followingListRef = useTemplateRef("followingListRef");
useScrollBottonDetect(followingListRef, doOnBottom);

// functions
async function doOnBottom() {
  if (
    followStore.followingPagination?.totalPages &&
    page.value >= followStore.followingPagination?.totalPages - 1
  ) {
    return;
  }

  // next page
  page.value += 1;

  // fetch comments for the next page
  await followStore.fetchFollowingCustomers(props.customerId, page.value);
}

function closeModal() {
  modalStore.resolve(false);
}

// lifecycle hooks
onMounted(async () => {
  await followStore.fetchFollowingCustomers(props.customerId);
});
</script>
<template>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-md h-[80vh] overflow-hidden flex flex-col">
    <!-- header -->
    <div class="border-b p-4 font-semibold text-sm flex justify-between items-center">
      <h2 class="text-xl font-semibold">Following</h2>
      <button
        @click="closeModal"
        class="text-gray-400 hover:text-gray-700 text-xs"
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <div ref="followingListRef" class="overflow-scroll p-4 h-full">
      <div v-if="followed && followed.length > 0" class="space-y-4">
        <span
          v-for="follow in followed"
          :key="follow.followedCustomerId"
          class="flex items-center justify-between w-full"
        >
          <div class="flex items-center gap-4">
            <img
              v-if="follow.followedCustomerProfileImageFilename"
              alt="Profile Image"
              :src="follow.followedCustomerProfileImageFilename"
              class="w-12 h-12 rounded-full object-cover"
            />
            <img
              v-else
              alt="Profile Image"
              src="/public/avatar.jpg"
              class="w-12 h-12 rounded-full object-cover"
            />
            <router-link @click="closeModal" :to="`/@${follow.followedCustomerUsername}`">
              {{ follow.followedCustomerUsername }}
            </router-link>
          </div>
          <FollowButton :is-following="true" :customer-id="follow.followedCustomerId" />
        </span>
      </div>

      <div v-else class="text-gray-500 text-center py-8">No followed yet.</div>
    </div>
  </div>
</template>
