<script setup lang="ts">
import { reactive, ref } from "vue";
import { authService } from "@/services/authService";
import type { JsonResponse } from "@/types/JsonResponse";
import { useRoute } from "vue-router";
const route = useRoute();
const token = ref<string>(String(route.params.token) || "");

// form
const formFields = reactive([
  {
    name: "password1",
    type: "password",
    placeholder: "Password",
    value: "",
  },
  {
    name: "password2",
    type: "password",
    placeholder: "Repeat password",
    value: "",
  },
]);

const message = ref({
  content: "",
  isError: false,
});

async function setPassword() {
  message.value.content = "";
  message.value.isError = false;

  // field validation
  for (const field of formFields) {
    if (field.value.trim().length == 0) {
      console.log("aasdasdads");
      message.value.content = "Password is empty.";
      message.value.isError = true;
      return;
    }
  }

  // check if password does not match
  if (formFields[0].value !== formFields[1].value) {
    message.value.content = "Password does not match.";
    message.value.isError = true;
    return;
  }

  try {
    const response: JsonResponse = await authService.resetPasswordSet(
      formFields[0].value,
      token.value
    );
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
      v-for="(input, index) in formFields"
      :key="index"
      v-model="input.value"
      :type="input.type"
      class="bg-white p-3 rounded-lg shadow-md"
      :placeholder="input.placeholder"
    />
    <span
      v-if="message.content"
      class="text-sm ml-4"
      :class="message.isError ? 'text-red-500' : ''"
      >{{ message.content }}</span
    >
    <button @click="setPassword" class="btn btn-sm btn-primary">Change password</button>
  </div>
</template>
