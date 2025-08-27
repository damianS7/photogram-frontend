<script setup lang="ts">
import { followService } from "@/services/followService";
import { useFeedStore } from "@/stores/feed";
import { useFollowStore } from "@/stores/follow";
import { onMounted, ref } from "vue";

// props
const props = defineProps<{
  customerId: number;
  isFollowing?: boolean;
}>();

// store
const followStore = useFollowStore();
const feedStore = useFeedStore();

// data
const isFollowing = ref(false);

// functions
function follow() {
  followStore.follow(props.customerId).then(() => {
    isFollowing.value = true;
    feedStore.refreshFeed();
  });
}

function unfollow() {
  followStore.unfollow(props.customerId).then(() => {
    isFollowing.value = false;
    feedStore.refreshFeed();
  });
}

function checkFollowing() {
  if (props.isFollowing) {
    isFollowing.value = props.isFollowing;
    return;
  }

  followService
    .getFollow(props.customerId)
    .then(() => {
      isFollowing.value = true;
    })
    .catch(() => {
      isFollowing.value = false;
    });
}

// lifecycle hooks
onMounted(() => {
  checkFollowing();
});
</script>
<template>
  <button v-if="isFollowing" @click="unfollow" class="btn btn-sm btn-danger">Unfollow</button>
  <button v-else @click="follow" class="btn btn-sm btn-primary">Follow</button>
</template>
