<script setup lang="ts">
import { ref, computed } from "vue";
import { Save } from "lucide-vue-next";
import { AlertType } from "@/types/AlertType";
import { useSettingStore } from "@/stores/setting";
import type { Setting } from "@/types/Setting";

// store
const settingStore = useSettingStore();

// message to show
const alert = ref();

const settings = computed(() => settingStore.getSettings as Record<string, Setting>);

function saveSettings() {
  const settingsToSave = Object.values(settings.value).reduce(
    (acc, setting) => {
      acc[setting.id] = setting.value;
      return acc;
    },
    {} as Record<number, string>
  );

  settingStore
    .updateSettings(settingsToSave)
    .then(() => {
      alert.value.showMessage("Settings saved successfully.", AlertType.SUCCESS);
    })
    .catch((error) => {
      alert.value.showMessage(error.message, AlertType.ERROR);
    });
}
</script>
<template>
  <div class="main-container shadow-none rounded">
    <section
      class="sm:flex items-center justify-between text-xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Settings</h1>
      <button class="btn btn-xs btn-primary" @click="saveSettings">
        <Save :size="18" />
      </button>
    </section>

    <section class="container grid grid-cols-[200px_1fr] gap-4 p-4">
      <!-- Menú vertical -->
      <aside class="bg-gray-100 rounded-lg shadow p-4 flex flex-col gap-3">
        <a href="#" class="text-gray-700 hover:text-blue-600 font-semibold">Inicio</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-semibold">Perfil</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-semibold">Ajustes</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-semibold">Salir</a>
      </aside>

      <!-- Contenido principal -->
      <div>
        <form class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label class="text-md font-medium mb-2 sm:mb-0">Currency</label>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
