<script setup lang="ts">
import { dateUtils } from "@/utils/date";
import { useCommentStore } from "@/stores/comment";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { useScrollBottonDetect } from "@/composables/useScrollBottomDetect";
import Alert from "@/components/Alert.vue";
import { AlertType } from "@/types/AlertType";

const { toDatetime } = dateUtils();

// props
const props = defineProps<{
  postId: number;
}>();

// store
const commentStore = useCommentStore();

// data
const alert = ref();
const page = ref(0);
const comments = computed(() => {
  return commentStore.comments;
});

const commentListRef = useTemplateRef("commentListRef");
useScrollBottonDetect(commentListRef, doOnBottom);

// functions
async function doOnBottom() {
  if (
    commentStore.pagination?.totalPages &&
    page.value >= commentStore.pagination?.totalPages - 1
  ) {
    return;
  }

  // next page
  page.value += 1;

  // fetch comments for the next page
  // await commentStore.fetchComments(props.postId, page.value);
  await fetchComments(props.postId, page.value);
}

async function fetchComments(postId: number, page: number) {
  try {
    await commentStore.fetchComments(postId, page);
    // await commentStore.fetchComments(7, page);
  } catch (exception: unknown) {
    alert.value.handleException(exception, "Failed to fetch comments.", AlertType.ERROR);
  }
}

// lifecycle hooks
onMounted(async () => {
  // await commentStore.fetchComments(props.postId);
  await fetchComments(props.postId, page.value);
});
</script>
<template>
  <div ref="commentListRef" class="flex flex-col overflow-y-auto p-4 h-full gap-2 relative">
    <div class="absolute p-1 w-full">
      <Alert ref="alert" />
    </div>
    <TransitionGroup name="fade" tag="div" class="space-y-2">
      <slot v-if="comments.length > 0">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex flex-col border-2 border-dashed py-1 px-2 rounded bg-gray-100"
        >
          <span class="py-2 text-sm">
            {{ comment.message }}
          </span>
          <span class="flex justify-between items-center text-xs text-gray-500">
            <strong>{{ comment.username }}</strong>
            <span class="italic">
              {{ toDatetime(comment.createdAt) }}
            </span>
          </span>
        </div>
      </slot>
      <div v-else class="text-center text-sm">No comments found.</div>
    </TransitionGroup>
  </div>
</template>
<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-move {
  transition: transform 0.3s ease;
}
</style>
