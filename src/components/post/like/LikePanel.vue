<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Heart } from "lucide-vue-next";
import { useLikeStore } from "@/stores/like";

// props
const props = defineProps<{
  postId: number;
}>();

// store
const likeStore = useLikeStore();

// data
const hasLiked = computed(() => {
  return likeStore.likes.hasBeenLiked;
});

const likeCount = computed(() => {
  return likeStore.likes.totalLikes;
});

// functions
async function like() {
  await likeStore.like(props.postId);
}

async function unlike() {
  await likeStore.unlike(props.postId);
}

onMounted(async () => {
  await likeStore.fetchLikes(props.postId);
});
</script>
<template>
  <div class="flex items-center gap-1 px-1 py-0.5">
    <button v-if="hasLiked" @click="unlike">
      <Heart :size="18" class="text-red-500" style="fill: currentColor" />
    </button>
    <button v-else @click="like">
      <Heart :size="18" class="text-red-300" />
    </button>
    <span>{{ likeCount }}</span>
  </div>
</template>
