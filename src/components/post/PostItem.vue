<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { onMounted, ref } from "vue";
import type { Post } from "@/types/Post";
import { useCustomerStore } from "@/stores/customer";
import { usePostStore } from "@/stores/post";
import { Heart } from "lucide-vue-next";
import { useCommentStore } from "@/stores/comment";
import CommentList from "./comment/CommentList.vue";
import { useUtil } from "@/composables/useUtil";
const { toDatetime } = useUtil();
const props = defineProps<{
  post: Post;
}>();

const commentStore = useCommentStore();
const modalStore = useModalStore();
const postStore = usePostStore();
function cancel() {
  modalStore.resolve(false);
}

const emit = defineEmits(["submit", "cancel"]);

const imagePreview = ref<string | null>(props.post.photoFilename);
const comment = ref("");

function isLoggedUserPost() {
  const loggedUserCustomerId = useCustomerStore().customer.id;

  return loggedUserCustomerId === props.post.customerId ? true : false;
}

async function postComment() {
  await commentStore.postComment(props.post.id, comment.value);
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
onMounted(async () => {
  await commentStore.fetchComments(props.post.id);
});
</script>
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-hidden flex">
      <!-- Imagen -->
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
        <!-- Encabezado -->
        <div class="border-b p-4 font-semibold text-sm flex justify-between items-center">
          <button v-if="isLoggedUserPost()" @click="deletePost" class="btn btn-xs btn-danger">
            DELETE POST
          </button>
          <span v-else>&nbsp;</span>
          <button @click="cancel" class="text-gray-400 hover:text-gray-700 text-xs">✕</button>
        </div>

        <!-- comment list  -->
        <div v-if="post.description" class="border-b p-4 gap-1">
          <span>
            {{ post.description }}
          </span>
          <span class="flex text-xs italic justify-end">
            {{ toDatetime(post.createdAt) }}
          </span>
        </div>

        <div class="overflow-hidden h-full">
          <CommentList :post-id="post.id" />
        </div>

        <!-- comment form -->
        <div class="border-t p-4 flex items-center gap-2">
          <textarea
            v-model="comment"
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
