<script setup lang="ts">
import { ref } from "vue";
import LoadingSpinner from "@/components/spinner/LoadingSpinner.vue";
import { useSpinnerStore } from "@/stores/spinner";
import { useModalStore } from "@/stores/modal";
const modalStore = useModalStore();
const screenSpinner = useSpinnerStore();

const spinnerMini1Loading = ref(false);
const spinnerMini2Loading = ref(false);
const spinnerMini3Loading = ref(false);

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

      <button class="btn btn-primary btn-lg" @click="saveSettings">Modal Store</button>
    </div>
  </div>
</template>
<style scoped></style>
