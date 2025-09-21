<script setup lang="ts">
import { reactive, ref } from "vue";
import { authService } from "@/services/authService";
import type { ApiResponse } from "@/types/ApiResponse";
import { useRoute } from "vue-router";
import Alert from "@/components/Alert.vue";
import { AlertType } from "@/types/AlertType";
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

const alert = ref();

async function setPassword() {
  // field validation
  for (const field of formFields) {
    if (field.value.trim().length == 0) {
      alert.value.showMessage("Password is empty.", AlertType.ERROR);
      return;
    }
  }

  // check if password does not match
  if (formFields[0].value !== formFields[1].value) {
    alert.value.showMessage("Password does not match.", AlertType.ERROR);
    return;
  }

  try {
    const response: ApiResponse = await authService.resetPasswordSet(
      formFields[0].value,
      token.value
    );
    alert.value.showMessage(response.message, AlertType.SUCCESS);
  } catch (error: any) {
    alert.value.showException(error);
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
    <div class="p-1 w-full">
      <Alert ref="alert" />
    </div>
    <button @click="setPassword" class="btn btn-sm btn-primary">Change password</button>
  </div>
</template>
