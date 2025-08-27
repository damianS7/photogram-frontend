<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { ref } from "vue";
import { usePostStore } from "@/stores/post";
import { useFeedStore } from "@/stores/feed";
import Alert from "../Alert.vue";
import { AlertType } from "@/types/AlertType";

// props
defineProps<{
  title?: string;
  message?: string;
}>();

// store
const postStore = usePostStore();
const feedStore = useFeedStore();
const modalStore = useModalStore();

// data
const image = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const caption = ref("");
const isSubmitting = ref(false);
const alert = ref();

// methods
function closeModal() {
  modalStore.resolve(false);
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    image.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

async function handleSubmit() {
  if (!image.value) return;
  isSubmitting.value = true;

  let filename = "";

  try {
    filename = await postStore.uploadPhoto(image.value);
  } catch (error) {
    alert.value.showMessage("Failed to upload photo.", AlertType.ERROR);
  }

  try {
    postStore.createPost(filename, caption.value);
    feedStore.refreshFeed();
    // clean
    isSubmitting.value = false;
    image.value = null;
    imagePreview.value = null;
    caption.value = "";
    closeModal();
  } catch (error) {
    alert.value.showMessage("Failed to create post.", AlertType.ERROR);
  }
}
</script>
<template>
  <div
    class="bg-white rounded-lg shadow-lg w-full max-w-md h-full max-h-screen overflow-y-auto flex flex-col relative"
  >
    <div class="absolute p-1 w-full">
      <Alert ref="alert" />
    </div>
    <!-- title -->
    <div class="border-b px-4 py-3 text-center font-semibold shrink-0">{{ title }}</div>

    <!-- form -->
    <form @submit.prevent="handleSubmit" class="p-4 space-y-4 flex-1 flex flex-col overflow-y-auto">
      <!-- img preview -->
      <div
        v-if="imagePreview"
        class="w-full max-h-64 overflow-hidden rounded border border-dashed p-1 shrink-0 flex items-center justify-center"
      >
        <img :src="imagePreview" alt="Preview" class="object-contain max-h-full w-auto h-auto" />
      </div>

      <!-- image input -->
      <label
        class="block w-full cursor-pointer border border-dashed border-gray-300 p-4 text-center rounded text-sm text-gray-500 hover:border-gray-400 shrink-0"
      >
        <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
        <span v-if="!imagePreview">Upload an image</span>
        <span v-else class="text-blue-600 underline">Change image</span>
      </label>

      <!-- comment -->
      <textarea
        v-model="caption"
        rows="3"
        placeholder="Write a description or comment this photo..."
        class="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring focus:border-blue-300 flex-1"
      ></textarea>

      <!-- buttons -->
      <div class="flex justify-end gap-2 pt-2 shrink-0">
        <button type="button" @click="closeModal" class="text-sm text-gray-600 hover:underline">
          Cancel
        </button>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded"
          :disabled="!image || isSubmitting"
        >
          Publish
        </button>
      </div>
    </form>
  </div>
</template>
