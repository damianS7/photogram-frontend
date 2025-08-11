<script setup lang="ts">
import { useUtil } from "@/composables/useUtil";
import { useCommentStore } from "@/stores/comment";
import { computed, onMounted, onUnmounted, ref } from "vue";
const { toDatetime } = useUtil();
const props = defineProps<{
  postId: number;
}>();

const commentListRef = ref<HTMLDivElement | null>(null);
const page = ref(0);
const commentStore = useCommentStore();
const comments = computed(() => {
  return commentStore.comments;
});

async function detectBottom() {
  const { scrollTop, scrollHeight, clientHeight } = commentListRef.value as HTMLDivElement;

  // detect when hits the bottom
  if (scrollTop + clientHeight >= scrollHeight) {
    if (
      commentStore.pagination?.totalPages &&
      page.value >= commentStore.pagination?.totalPages - 1
    ) {
      return;
    }
    page.value += 1;
    await commentStore.fetchComments(props.postId, page.value);
  }
}

onMounted(async () => {
  // disable body scroll
  document.body.style.overflow = "hidden";
  await commentStore.fetchComments(props.postId);
  if (commentListRef.value) {
    commentListRef.value.addEventListener("scroll", detectBottom);
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
  if (commentListRef.value) {
    commentListRef.value.removeEventListener("scroll", detectBottom);
  }
});
</script>
<template>
  <div
    ref="commentListRef"
    v-if="comments.length > 0"
    class="flex flex-col overflow-y-auto p-4 h-full gap-2"
  >
    <div
      v-for="(comment, index) in comments"
      :key="index"
      class="flex flex-col border-2 border-dashed py-1 px-2 rounded bg-gray-100"
    >
      <span class="py-2 text-sm">
        {{ comment.content }}
      </span>
      <span class="flex justify-between items-center text-xs text-gray-500">
        <strong>{{ comment.username }}</strong>
        <span class="italic">
          {{ toDatetime(comment.createdAt) }}
        </span>
      </span>
    </div>
  </div>
  <div v-else class="p-4 text-center text-sm">No comments found.</div>
</template>
