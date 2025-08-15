import { onMounted, onUnmounted, type Ref } from "vue";

export function useScrollBottonDetect(element: Ref<HTMLDivElement | null>, doSomething: () => any) {
  // functions
  async function detectBottom() {
    if (!element.value) return;
    const { scrollTop, scrollHeight, clientHeight } = element.value;

    // detect when hits the bottom
    if (scrollTop + clientHeight >= scrollHeight) {
      // do something
      return doSomething();
    }
  }

  // lifecycle hooks
  onMounted(() => {
    if (!element.value) return;
    // disable body scroll
    document.body.style.overflow = "hidden";
    element.value.addEventListener("scroll", detectBottom);
  });

  onUnmounted(() => {
    if (element.value) {
      element.value.removeEventListener("scroll", detectBottom);
    }
    document.body.style.overflow = "";
  });

  return { detectBottom };
}
