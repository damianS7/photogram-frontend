<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
defineProps<{
  title: string;
  message: string;
}>();

const modalStore = useModalStore();

function confirm() {
  modalStore.resolve(true);
}

function cancel() {
  modalStore.resolve(false);
}
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <div class="mb-4">
        <p>{{ message }}</p>
      </div>

      <div class="flex justify-end gap-2">
        <button type="button" @click="cancel" class="btn btn-sm btn-secondary">CANCEL</button>
        <button type="button" @click="confirm" class="btn btn-sm btn-primary">CONFIRM</button>
      </div>
    </div>
  </div>
</template>
