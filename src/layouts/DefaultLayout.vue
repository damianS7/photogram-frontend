<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useSpinnerStore } from "@/stores/spinner";
const screenSpinner = useSpinnerStore();
const authStore = useAuthStore();
const router = useRouter();
const tokenValidationInterval = 30 * 1000; // 30s
let interval: NodeJS.Timeout;
let initialized = ref(false);

async function checkIfTokenIsValid() {
  const token = authStore.token;
  await authStore.isTokenValid(token).catch(async () => {
    initialized.value = false;
    await authStore.logout();
    await wait(100);
    router.push("/auth/login");
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function wait(ms: number) {
  await sleep(ms); // Espera 2 segundos
}

onMounted(async () => {
  interval = setInterval(async () => {
    await checkIfTokenIsValid();
  }, tokenValidationInterval);

  //   await customerStore.initialize();
  //   await settingStore.initialize();
  initialized.value = true;
  screenSpinner.hide();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
<template>
  <main class="flex flex-col h-screen overflow-hidden">
    <Header />
    <div class="flex h-full p-6 overflow-hidden w-full sm:max-w-sm mx-auto">
      <div
        class="main-container flex w-full rounded shadow border-2 border-gray-300 overflow-hidden"
      >
        <div>
          <Sidebar />
        </div>
        <div class="w-full h-full">
          <router-view />
        </div>
      </div>
    </div>
  </main>
</template>
