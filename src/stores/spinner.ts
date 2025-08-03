// setup store
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSpinnerStore = defineStore("spinner", () => {
  // state
  const visible = ref(false);

  // getters
  const isVisible = computed(() => visible.value);

  // actions
  function show() {
    visible.value = true;
  }

  function hide() {
    visible.value = false;
  }
  return { visible, isVisible, show, hide };
});
