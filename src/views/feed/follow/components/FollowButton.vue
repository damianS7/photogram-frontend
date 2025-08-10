<script setup lang="ts">
import { followService } from "@/services/followService";
import { useFeedStore } from "@/stores/feed";
import { useFollowStore } from "@/stores/follow";
import { onMounted, ref } from "vue";
const props = defineProps<{
  customerId: number;
  isFollowing?: boolean;
}>();
const isFollowing = ref(false);
const followStore = useFollowStore();
const feedStore = useFeedStore();

async function follow() {
  let followerCount = feedStore.feed?.followers as number;
  if (typeof followerCount !== "number") {
    return;
  }

  await followStore.follow(props.customerId).then(() => {
    feedStore.updateFeed({ followers: followerCount + 1 });
    isFollowing.value = true;
  });
}

async function unfollow() {
  let followerCount = feedStore.feed?.followers as number;
  if (typeof followerCount !== "number") {
    return;
  }

  await followStore.unfollow(props.customerId).then(() => {
    feedStore.updateFeed({ followers: followerCount - 1 });
    isFollowing.value = false;
  });
}

onMounted(async () => {
  if (props.isFollowing) {
    isFollowing.value = props.isFollowing;
  }

  if (!props.isFollowing) {
    isFollowing.value = await followService.isFollowing(props.customerId);
  }
});
</script>
<template>
  <button v-if="isFollowing" @click="unfollow" class="btn btn-sm btn-danger">Unfollow</button>
  <button v-else @click="follow" class="btn btn-sm btn-primary">Follow</button>
</template>
