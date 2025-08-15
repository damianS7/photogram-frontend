<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { onMounted, ref } from "vue";
import type { Post } from "@/types/Post";
import { usePostStore } from "@/stores/post";
import { useCommentStore } from "@/stores/comment";
import CommentList from "./comment/CommentList.vue";
import { dateUtils } from "@/utils/date";
import { authUtils } from "@/utils/auth";
import LikePanel from "./like/LikePanel.vue";
import Alert from "../Alert.vue";
import { useFeedStore } from "@/stores/feed";
import { AlertType } from "@/types/AlertType";
const { isCurrentUserOwner } = authUtils();
const { toDatetime } = dateUtils();

// props
const props = defineProps<{
  post: Post;
}>();

// stores
const commentStore = useCommentStore();
const modalStore = useModalStore();
const feedStore = useFeedStore();
const postStore = usePostStore();

// data
const imagePreview = ref<string | null>(props.post.photoFilename);
const comment = ref("");
const commentTextareaRef = ref<HTMLDivElement | null>(null);
const alert = ref();

// methods
async function postComment() {
  // no empty comment allowed
  if (comment.value.trim() === "") {
    comment.value = "";
    alert.value.showMessage("Empty comments are not allowed.", AlertType.INFO);
    return;
  }

  try {
    await commentStore.postComment(props.post.id, comment.value);
    comment.value = "";
  } catch (error) {
    alert.value.showMessage("Failed to post comment.", AlertType.ERROR);
  }
}

async function deletePost() {
  const confirm = await modalStore.open("ConfirmModal", {
    title: "Delete post",
    message: "Are you sure you want to delete this post?",
  });

  if (confirm) {
    try {
      await postStore.deletePost(props.post.id);
      feedStore.updateFeed({ totalPosts: -1 });
    } catch (error) {
      alert.value.showMessage("Failed to delete post.", AlertType.ERROR);
    }
  }
}

// actions
function closeModal() {
  modalStore.resolve(false);
}

// lifececycle hooks
onMounted(async () => {
  commentTextareaRef.value?.focus();
});
</script>
<template>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-hidden flex">
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
    <div class="w-1/2 flex flex-col relative">
      <div class="absolute p-1 w-full">
        <Alert ref="alert" />
      </div>
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
</template>
