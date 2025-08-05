<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["confirm", "cancel"]);
const field = ref({
  name: "password",
  type: "password",
  placeholder: "Current password",
  value: "",
  error: "",
  isEditing: false,
});

function submit() {
  emit("confirm", field.value.value);
}

function cancel() {
  emit("cancel");
}
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Confirm your password</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Current password</label>
          <input :type="field.type" class="border rounded p-2 w-full" v-model="field.value" />
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" @click="cancel" class="bg-gray-300 rounded px-4 py-2">Close</button>
          <button type="submit" class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
            Confirm
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
