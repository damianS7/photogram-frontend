<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import type { Post } from "@/types/Post";
import { ImageOff } from "lucide-vue-next";

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
  <div>
    <div
      v-if="posts && posts.length > 0"
      class="mt-8 grid grid-cols-3 gap-0.5 mx-auto sm:max-w-2xl"
    >
      <div v-for="post in posts" :key="post.id" @click="showPost(post)" class="flex w-full h-72">
        <img
          v-if="post.photoFilename"
          :src="post.photoFilename"
          alt="Post Image"
          class="object-cover w-full h-full"
        />
        <div v-else class="flex flex-col bg-gray-300 w-full items-center justify-center">
          <ImageOff :size="32" />
          <p>No image found.</p>
        </div>
      </div>
    </div>
    <div v-else class="w-full text-center">
      <p>No posts found.</p>
    </div>
  </div>
</template>
