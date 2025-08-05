<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCustomerStore } from "@/stores/customer";
import { useSettingStore } from "@/stores/setting";
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import { useSpinnerStore } from "@/stores/spinner";
const screenSpinner = useSpinnerStore();
const authStore = useAuthStore();
const customerStore = useCustomerStore();
const settingStore = useSettingStore();
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
  screenSpinner.show();
  interval = setInterval(async () => {
    await checkIfTokenIsValid();
  }, tokenValidationInterval);

  await customerStore.initialize();
  await settingStore.initialize();
  initialized.value = true;
  screenSpinner.hide();
});
onUnmounted(() => {
  clearInterval(interval);
});
</script>
<template>
  <main v-if="initialized" class="flex flex-col">
    <Header />
    <div class="p-6 h-full">
      <router-view />
    </div>
  </main>
</template>
