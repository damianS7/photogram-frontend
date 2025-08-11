<script setup lang="ts">
import { useFollowStore } from "@/stores/follow";
import { useModalStore } from "@/stores/modal";
import { computed, onMounted, onUnmounted } from "vue";
import FollowButton from "./FollowButton.vue";
import type { Follow } from "@/types/Follow";
const props = defineProps<{
  customerId: number;
}>();
const followStore = useFollowStore();
const followed = computed(() => followStore.following as Follow[]);
const modalStore = useModalStore();

function closeModal() {
  modalStore.resolve(false);
}

onMounted(async () => {
  await followStore.fetchFollowings(props.customerId);
});

onUnmounted(() => {});
</script>
<template>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-md h-[90vh] overflow-hidden flex flex-col">
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

    <div class="overflow-scroll p-4 h-full">
      <div v-if="followed && followed.length > 0" class="space-y-4">
        <span
          v-for="follow in followed"
          :key="follow.id"
          class="flex items-center justify-between w-full"
        >
          <div class="flex items-center gap-4">
            <img
              alt="Profile Image"
              :src="follow.followedCustomerProfileImageFilename"
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
