<script setup lang="ts">
import { ref } from "vue";
import LoadingSpinner from "@/components/spinner/LoadingSpinner.vue";
import { useSpinnerStore } from "@/stores/spinner";
import { useModalStore } from "@/stores/modal";
import Alert from "@/components/Alert.vue";
import { AlertType } from "@/types/AlertType";
const modalStore = useModalStore();
const screenSpinner = useSpinnerStore();

const spinnerMini1Loading = ref(false);
const spinnerMini2Loading = ref(false);
const spinnerMini3Loading = ref(false);

const alert = ref();

async function saveSettings() {
  // const confirmModal = await modalStore.open("ConfirmModal", {
  //   title: "Confirm Settings",
  //   message: "Are you sure you want to save these settings?",
  // });
  // console.log("modal result" + confirmModal);

  const ConfirmPasswordModal = await modalStore.open("ConfirmPasswordModal", {
    title: "Confirm Password",
  });
}
</script>
<template>
  <div class="home">
    <h1>Welcome to app</h1>
    <p>This is the home page.</p>
    <div class="gap-4 flex flex-col items-center">
      <button class="btn btn-primary btn-lg" @click="screenSpinner.show()">Show Spinner</button>
      <button class="btn btn-primary btn-lg">Show Toast</button>

      <button class="btn btn-primary btn-lg" @click="spinnerMini1Loading = true">
        Show Mini Spinner 1
      </button>
      <LoadingSpinner v-if="spinnerMini1Loading" />

      <button class="btn btn-primary btn-lg" @click="spinnerMini2Loading = true">
        Show Mini Spinner 2
      </button>
      <LoadingSpinner v-if="spinnerMini2Loading" :size="2" />

      <button class="btn btn-primary btn-lg" @click="spinnerMini3Loading = true">
        Show Mini Spinner 3
      </button>
      <LoadingSpinner v-if="spinnerMini3Loading" :size="6" />

      <Alert class="mb-4" ref="alert" />
      <button
        class="btn btn-primary btn-lg"
        @click="alert.showMessage('Field successfully updated.', AlertType.SUCCESS)"
      >
        Show alert
      </button>

      <button class="btn btn-primary btn-lg" @click="saveSettings">Modal Store</button>
    </div>
  </div>
</template>
<style scoped></style>
