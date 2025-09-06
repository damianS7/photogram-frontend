<script setup lang="ts">
import Alert from "@/components/Alert.vue";
import { ref } from "vue";
import { Save } from "lucide-vue-next";

// message to show
const alert = ref();

// functions
function saveSettings() {
  //
}
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden relative">
    <div class="absolute p-2 w-full">
      <Alert ref="alert" />
    </div>
    <section
      class="sm:flex items-center justify-between text-xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Notifications</h1>
      <button class="btn btn-xs btn-primary" @click="saveSettings">
        <Save :size="18" />
      </button>
    </section>

    <section class="overflow-scroll h-full p-4">
      <div class="flex justify-between w-full">
        <span>Enable notifications</span>
        <span>
          <select name="" id="">
            <option value="">Y</option>
            <option value="">N</option>
          </select>
        </span>
      </div>
    </section>
  </div>
</template>
