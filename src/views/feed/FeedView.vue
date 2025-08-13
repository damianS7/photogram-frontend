<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import FeedHeader from "./components/FeedHeader.vue";
import PostList from "@/components/post/PostList.vue";
import { useRoute } from "vue-router";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { usePostStore } from "@/stores/post";
import { useModalStore } from "@/stores/modal";
import { useFeedStore } from "@/stores/feed";
import { customerService } from "@/services/customerService";
import { useAuth } from "@/composables/useAuth";
const { isCurrentUserOwner } = useAuth();

// props
defineProps<{
  username?: string;
}>();

// store
const modalStore = useModalStore();
const customerStore = useCustomerStore();
const feedStore = useFeedStore();
const postStore = usePostStore();

// data
const page = ref(0);
const loading = ref(true);
const usernameExist = ref(false);
const route = useRoute();
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

// functions
async function createPost() {
  await modalStore.open("PostCreate", {
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

async function detectBottom() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement as HTMLDivElement;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (postStore.pagination?.totalPages && page.value >= postStore.pagination?.totalPages - 1) {
      return;
    }
    window.removeEventListener("scroll", detectBottom);
    page.value += 1;
    await postStore.fetchPosts(username.value, page.value);
    setTimeout(() => {
      window.addEventListener("scroll", detectBottom);
    }, 300);
  }
}

// lifecycle hooks
onMounted(() => {
  window.addEventListener("scroll", detectBottom);
});

onUnmounted(() => {
  window.removeEventListener("scroll", detectBottom);
});
</script>
<template>
  <div v-if="usernameExist && !loading && feed">
    <FeedHeader v-if="feed" :feed="feed" />
    <div v-if="isCurrentUserOwner(feed.customerId)" class="text-center">
      <button class="bg-blue-600 py-2 px-4 text-white font-bold rounded-full" @click="createPost">
        +
      </button>
    </div>
    <PostList v-if="posts" :posts="posts" />
  </div>
  <div v-if="!usernameExist && !loading">Username not found</div>
</template>
