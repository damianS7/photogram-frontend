<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useSettingStore } from "@/stores/setting";
import Sidebar from "@/views/settings/components/Sidebar.vue";
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
const authStore = useAuthStore();
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
  interval = setInterval(async () => {
    await checkIfTokenIsValid();
  }, tokenValidationInterval);

  initialized.value = true;
});
onUnmounted(() => {
  clearInterval(interval);
});
</script>
<template>
  <main v-if="initialized" class="flex flex-col h-screen">
    <Header />
    <div class="p-6 h-full overflow-hidden">
      <div
        class="grid grid-cols-[auto_1fr] h-full w-full overflow-hidden rounded shadow border-2 border-gray-300"
      >
        <div>
          <Sidebar />
        </div>
        <div class="container w-full overflow-hidden">
          <router-view />
        </div>
      </div>
    </div>
  </main>
</template>
