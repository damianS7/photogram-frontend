<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import { authService } from "@/services/authService";
import type { ApiResponse } from "@/types/ApiResponse";
import { AlertType } from "@/types/AlertType";
import Alert from "@/components/Alert.vue";

const route = useRoute();
const alert = ref();
const token = ref<string>((route.params.token as string | undefined) ?? "");

async function activateAccount() {
  if (token.value.trim().length <= 0) {
    alert.value.showMessage("Token cannot be empty.", AlertType.ERROR);
    return;
  }

  try {
    const response: ApiResponse = await authService.activateAccount(token.value);
    alert.value.showMessage(response.message, AlertType.SUCCESS);
  } catch (error: any) {
    alert.value.handleException(error);
  }
}
</script>
<template>
  <div class="flex flex-col gap-2">
    <input
      v-model="token"
      type="text"
      class="bg-white p-4 rounded-lg shadow-md"
      placeholder="Insert your token"
    />
    <div class="p-1 w-full">
      <Alert ref="alert" />
    </div>
    <span class="text-sm text-center"
      >I don't have a token.
      <RouterLink to="/accounts/resend-activation" class="hover:underline text-blue-600">
        Resend Activation
      </RouterLink>
    </span>
    <button @click="activateAccount" class="btn btn-sm btn-primary">Activate</button>
  </div>
</template>
