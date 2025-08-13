<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import type { Post } from "@/types/Post";

// props
const props = defineProps<{
  posts: Post[];
}>();

// store
const modalStore = useModalStore();

// functions
async function showPost(post: Post) {
  await modalStore.open("PostItem", {
    post,
  });
}
</script>
<template>
  <div class="mt-8 grid grid-cols-3 gap-0.5 mx-auto sm:max-w-2xl">
    <div
      v-if="posts"
      @click="showPost(post)"
      class="flex w-full h-72"
      v-for="post in posts"
      :key="post.id"
    >
      <img :src="post.photoFilename" alt="Post Image" class="object-cover w-full h-full" />
    </div>
    <div v-else>
      <p>No posts found.</p>
    </div>
  </div>
</template>
