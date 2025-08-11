<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { onMounted, onUnmounted, ref } from "vue";
import type { Post } from "@/types/Post";
import { usePostStore } from "@/stores/post";
import { useCommentStore } from "@/stores/comment";
import CommentList from "./comment/CommentList.vue";
import { useUtil } from "@/composables/useUtil";
import { useAuth } from "@/composables/useAuth";
import LikePanel from "./like/LikePanel.vue";
const { isCurrentUserOwner } = useAuth();
const { toDatetime } = useUtil();
const props = defineProps<{
  post: Post;
}>();

// stores
const commentStore = useCommentStore();
const modalStore = useModalStore();
const postStore = usePostStore();

// refs
const imagePreview = ref<string | null>(props.post.photoFilename);
const comment = ref("");
const commentTextareaRef = ref<HTMLDivElement | null>(null);

// methods
async function postComment() {
  // no empty comment allowed
  if (comment.value.trim() === "") {
    comment.value = "";
    return;
  }

  await commentStore.postComment(props.post.id, comment.value);
  comment.value = "";
}

async function deletePost() {
  const confirm = await modalStore.open("ConfirmModal", {
    title: "Delete post",
    message: "Are you sure you want to delete this post?",
  });

  if (!confirm) {
    return;
  }

  postStore.deletePost(props.post.id);
}

// actions
function closeModal() {
  modalStore.resolve(false);
}

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeModal();
  }
};

// lifececycle hooks
onMounted(async () => {
  commentTextareaRef.value?.focus();
  await commentStore.fetchComments(props.post.id);
  window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc);
});
</script>
<template>
  <div
    @click="closeModal"
    class="fixed inset-0 z-50 flex bg-black items-center justify-center bg-opacity-60 p-4"
  >
    <div
      @click.stop
      class="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-hidden flex"
    >
      <!-- post image preview -->
      <div class="w-1/2 bg-black flex items-center justify-center">
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Preview"
          class="object-contain max-h-full max-w-full"
        />
        <div v-else class="text-white">No image selected</div>
      </div>

      <!-- comments list and form -->
      <div class="w-1/2 flex flex-col">
        <!-- post header -->
        <div class="border-b p-4 font-semibold text-sm flex justify-between items-center">
          <button
            v-if="isCurrentUserOwner(post.customerId)"
            @click="deletePost"
            class="btn btn-xs btn-danger"
          >
            DELETE POST
          </button>
          <span v-else>&nbsp;</span>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-700 text-xs">✕</button>
        </div>

        <!-- comment list  -->
        <div class="border-b p-2">
          <span v-if="post.description" class="text-sm flex mb-2">
            {{ post.description }}
          </span>
          <span class="flex text-xs italic justify-between items-center px-4">
            <span>
              <LikePanel :post-id="post.id" />
            </span>
            <span>
              {{ toDatetime(post.createdAt) }}
            </span>
          </span>
        </div>

        <div class="overflow-hidden h-full">
          <CommentList :post-id="post.id" />
        </div>

        <!-- comment form -->
        <div class="border-t p-4 flex items-center gap-2">
          <textarea
            ref="commentTextareaRef"
            v-model="comment"
            @keyup.enter="postComment"
            rows="1"
            placeholder="Add a comment..."
            class="flex-1 border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>
          <button
            type="submit"
            @click="postComment"
            class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
