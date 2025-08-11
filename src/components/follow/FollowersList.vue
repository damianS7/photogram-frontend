<script setup lang="ts">
import { useFollowStore } from "@/stores/follow";
import { useModalStore } from "@/stores/modal";
import { computed, onMounted, onUnmounted } from "vue";
const props = defineProps<{
  customerId: number;
}>();
const followStore = useFollowStore();
const followers = computed(() => followStore.followers);
const modalStore = useModalStore();

function closeModal() {
  modalStore.resolve(false);
}

onMounted(async () => {
  await followStore.fetchFollowers(props.customerId);
});

onUnmounted(() => {});
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
        <span v-for="follow in followers" :key="follow.id" class="flex items-center gap-4">
          <img
            alt="Profile Image"
            :src="follow.followerCustomerProfileImageFilename"
            class="w-12 h-12 rounded-full object-cover"
          />
          <router-link @click="closeModal" :to="`/@${follow.followerCustomerUsername}`">
            {{ follow.followerCustomerUsername }}
          </router-link>
        </span>
      </div>

      <div v-else class="text-gray-500 text-center py-8">No followers yet.</div>
    </div>
  </div>
</template>
