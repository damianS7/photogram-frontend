// src/stores/modalStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const component = ref<null | string>(null);
  const props = ref<any>(null);
  let resolver: (value: any) => void;

  function open(name: string, newProps: any) {
    component.value = name;
    props.value = newProps;

    return new Promise((resolve) => {
      resolver = resolve;
    });
  }

  function resolve(result: any) {
    component.value = null;
    props.value = null;
    resolver?.(result);
  }

  return { component, props, open, resolve };
});
