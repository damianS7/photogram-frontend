<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { ref } from "vue";
defineProps<{
  title: string;
}>();

const fields = ref({
  password: "",
  confirmPassword: "",
});

const modalStore = useModalStore();

function confirm() {
  if (fields.value.password !== fields.value.confirmPassword) {
    return;
  }
  modalStore.resolve(fields.value.password);
}

function cancel() {
  modalStore.resolve(false);
  // modalStore.resolve("");
}
</script>
<template>
  <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
    <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>

    <div class="mb-4">
      <label class="block mb-1">Password</label>
      <input type="password" v-model="fields.password" class="w-full border rounded p-2" required />
    </div>

    <div class="mb-4">
      <label class="block mb-1">Confirm Password</label>
      <input
        type="password"
        v-model="fields.confirmPassword"
        class="w-full border rounded p-2"
        required
      />
    </div>
    <div class="flex justify-end gap-2">
      <button type="button" @click="cancel" class="bg-gray-300 rounded px-4 py-2">Cancel</button>
      <button
        type="submit"
        @click="confirm"
        class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Confirm
      </button>
    </div>
  </div>
</template>
