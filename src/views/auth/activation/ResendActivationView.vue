<script setup lang="ts">
import { ref } from "vue";
import { authService } from "@/services/authService";
import type { JsonResponse } from "@/types/JsonResponse";

const email = ref("");
const message = ref({
  content: "",
  isError: false,
});

async function resendAccountActivation() {
  message.value.content = "";
  message.value.isError = false;

  try {
    const response: JsonResponse = await authService.resendAccountActivation(email.value);
    message.value.content = response.message;
  } catch (error: any) {
    message.value.content = error.message;
    message.value.isError = true;
  }
}
</script>
<template>
  <div class="flex flex-col gap-2">
    <input
      v-model="email"
      type="email"
      class="bg-white p-3 rounded-lg shadow-md"
      placeholder="Insert your email"
    />
    <span
      v-if="message.content"
      class="text-sm ml-4"
      :class="message.isError ? 'text-red-500' : ''"
      >{{ message.content }}</span
    >
    <button @click="resendAccountActivation" class="btn btn-sm btn-primary">
      Send activation email
    </button>
  </div>
</template>
