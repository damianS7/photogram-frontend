<script setup lang="ts">
import { ref } from "vue";
import { authService } from "@/services/authService";
import type { ApiResponse } from "@/types/ApiResponse";
import { AlertType } from "@/types/AlertType";
import Alert from "@/components/Alert.vue";

const email = ref("");
const alert = ref();

async function resetPassword() {
  if (email.value.trim().length <= 0) {
    alert.value.showMessage("Email cannot be empty.", AlertType.ERROR);
    return;
  }

  try {
    const response: ApiResponse = await authService.resetPasswordRequest(email.value);
    alert.value.showMessage(response.message, AlertType.SUCCESS);
  } catch (error: any) {
    alert.value.handleException(error);
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
    <div class="p-1 w-full">
      <Alert ref="alert" />
    </div>
    <button @click="resetPassword" class="btn btn-sm btn-primary">Reset password</button>
  </div>
</template>
