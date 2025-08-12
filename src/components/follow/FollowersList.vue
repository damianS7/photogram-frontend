<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useFollowStore } from "@/stores/follow";
import { useModalStore } from "@/stores/modal";

// props
const props = defineProps<{
  customerId: number;
}>();

// store
const followStore = useFollowStore();
const followers = computed(() => followStore.followers);
const modalStore = useModalStore();

// functions
function closeModal() {
  modalStore.resolve(false);
}

// lifecycle hooks
onMounted(async () => {
  await followStore.fetchCustomerFollowers(props.customerId);
});
</script>
<template>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-md h-[90vh] overflow-hidden flex flex-col">
    <!-- header -->
    <div class="border-b p-4 font-semibold text-sm flex justify-between items-center">
      <h2 class="text-xl font-semibold">Followers</h2>
      <button
        @click="closeModal"
        class="text-gray-400 hover:text-gray-700 text-xs"
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <div class="overflow-scroll p-4 h-full">
      <div v-if="followers && followers.length > 0" class="space-y-4">
        <span v-for="follower in followers" :key="follower.id" class="flex items-center gap-4">
          <img
            alt="Profile Image"
            :src="follower.followerCustomerProfileImageFilename"
            class="w-12 h-12 rounded-full object-cover"
          />
          <router-link @click="closeModal" :to="`/@${follower.followerCustomerUsername}`">
            {{ follower.followerCustomerUsername }}
          </router-link>
        </span>
      </div>

      <div v-else class="text-gray-500 text-center py-8">No followers yet.</div>
    </div>
  </div>
</template>
