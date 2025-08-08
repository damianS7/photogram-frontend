<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import FeedHeader from "./components/FeedHeader.vue";
import FeedPostList from "./components/FeedPostList.vue";
import { useRoute } from "vue-router";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { usePostStore } from "@/stores/post";
import type { Post } from "@/types/Post";
import { useModalStore } from "@/stores/modal";
import type { Feed } from "@/types/Feed";
import { useFeedStore } from "@/stores/feed";
import { customerService } from "@/services/customerService";

defineProps<{
  username?: string;
}>();
const loading = ref(true);
const usernameExist = ref(false);
const modalStore = useModalStore();
const customerStore = useCustomerStore();
const feedStore = useFeedStore();
const route = useRoute();
const postStore = usePostStore();
const feed = computed(() => {
  return feedStore.feed;
});
const posts = computed(() => {
  return postStore.posts;
});
const username = computed(() => {
  return (route.params.username || customerStore.customer.profile?.username) as string;
});

watch(
  () => username.value,
  () => loadFeed(),
  { immediate: true }
);

async function createPost() {
  const post = await modalStore.open("FeedPostCreate", {
    title: "Create a new post",
  });
}

async function loadFeed() {
  loading.value = true;
  usernameExist.value = await customerService.usernameExists(username.value);
  if (!usernameExist.value) {
    loading.value = false;
    return;
  }

  await feedStore.fetchFeed(username.value);
  await postStore.fetchPosts(username.value);
  loading.value = false;
}
</script>
<template>
  <div v-if="usernameExist && !loading">
    <FeedHeader v-if="feed" :feed="feed" />
    <div class="text-center">
      <button class="bg-blue-600 py-2 px-4 text-white font-bold rounded-full" @click="createPost">
        +
      </button>
    </div>
    <FeedPostList v-if="posts" :posts="posts" />
  </div>
  <div v-if="!usernameExist && !loading">Username not found</div>
</template>
