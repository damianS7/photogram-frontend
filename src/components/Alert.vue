<script setup lang="ts">
import { ref } from "vue";
import { AlertType } from "@/types/AlertType";
import { ApiError } from "@/types/ApiError";

// alert properties
const alert = ref({
  message: "",
  errors: {},
  type: AlertType.ERROR,
  timeout: 10,
  visible: false,
  autoClose: false,
});

function show(message: string, type: AlertType, timeout?: number) {
  alert.value.type = type;
  alert.value.message = message;
  alert.value.visible = true;

  // if timeout is set
  if (timeout && timeout > 1) {
    alert.value.timeout = timeout;
    alert.value.autoClose = true;
  } else {
    alert.value.autoClose = false;
  }

  if (alert.value.autoClose) {
    setTimeout(() => {
      alert.value.visible = false;

      setTimeout(() => {
        hideAlert();
      }, 500);
    }, alert.value.timeout * 1000);
  }
}

function showMessage(message: string, type: AlertType, timeout?: number) {
  alert.value.errors = {};
  show(message, type, timeout);
}

function showException(exception: ApiError, timeout?: number) {
  alert.value.errors = exception.errors || {};
  show(exception.message, AlertType.ERROR, timeout);
}

function handleException(exception: unknown, altMessage?: string, timeout?: number) {
  if (!altMessage) {
    altMessage = "Unkown error";
  }

  if (exception instanceof ApiError) {
    show(exception.message || altMessage, AlertType.ERROR, timeout);
    alert.value.errors = exception.errors || {};
  } else {
    show(altMessage, AlertType.ERROR, timeout);
  }
}

function hideAlert() {
  alert.value.message = "";
  alert.value.errors = {};
}

defineExpose({ showMessage, showException, handleException });
</script>
<template>
  <div
    v-if="alert.message"
    class="flex items-center border px-4 py-3 rounded relative transition-opacity duration-500"
    :class="[
      alert.type === AlertType.INFO && 'bg-blue-100 border-blue-400 text-blue-700',
      alert.type === AlertType.ERROR && 'bg-red-100 border-red-400 text-red-700',
      alert.type === AlertType.SUCCESS && 'bg-green-100 border-green-400 text-green-700',
      alert.visible ? 'opacity-100' : 'opacity-0',
    ]"
    role="alert"
  >
    <span class="block sm:inline ml-2">
      <p>{{ alert.message }}</p>
      <ul v-if="alert.errors" class="list-disc ml-8">
        <li v-for="(errors, field) in alert.errors" :key="field">
          <b>{{ field }}</b>
          <p v-for="(error, field) in errors" :key="field">{{ error }}</p>
        </li>
      </ul>
    </span>
    <button type="button" class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="hideAlert()">
      <svg class="fill-current h-6 w-6 text-red-500" viewBox="0 0 20 20">
        <title>Close</title>
        <path
          d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.586 7.066 4.652a1 1 0 00-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 12.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934z"
        />
      </svg>
    </button>
  </div>
</template>
