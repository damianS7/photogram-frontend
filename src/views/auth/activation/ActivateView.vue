<script setup lang="ts">
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { authService } from "@/services/authService";
import type { JsonResponse } from "@/types/JsonResponse";
const router = useRouter();
const route = useRoute();

// const token = computed(() => {
//   return route.params.token as string;
// });

// const token = ref(route.params.token);
const token = ref<string>(String(route.params.token) || "");
const message = ref({
  content: "",
  isError: false,
});

async function activateAccount() {
  message.value.content = "";
  message.value.isError = false;
  try {
    const response: JsonResponse = await authService.activateAccount(token.value);
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
      v-model="token"
      type="text"
      class="bg-white p-4 rounded-lg shadow-md"
      placeholder="Insert your token"
    />
    <span
      v-if="message.content"
      class="text-sm ml-4"
      :class="message.isError ? 'text-red-500' : ''"
      >{{ message.content }}</span
    >
    <span class="text-sm text-center"
      >I don't have a token.
      <RouterLink to="/accounts/resend-activation" class="hover:underline text-blue-600">
        Resend Activation
      </RouterLink>
    </span>
    <button @click="activateAccount" class="btn btn-sm btn-primary">Activate</button>
  </div>
</template>
