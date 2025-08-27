<!-- ModalManager.vue -->
<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import ConfirmModal from "@/components/modals/ConfirmMessageModal.vue";
import ConfirmPasswordModal from "@/components/modals/ConfirmPasswordModal.vue";
import PostCreate from "@/components/post/PostCreate.vue";
import PostItem from "@/components/post/PostItem.vue";
import FollowersList from "@/components/follow/FollowersList.vue";
import FollowedList from "@/components/follow/FollowingList.vue";
import { onMounted, onUnmounted } from "vue";
const modalStore = useModalStore();

const modals = {
  ConfirmModal,
  ConfirmPasswordModal,
  PostCreate,
  PostItem,
  FollowersList,
  FollowedList,
};

function closeModal() {
  modalStore.resolve(false);
}

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeModal();
  }
};

onMounted(async () => {
  window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc);
});
</script>
<template>
  <div
    v-if="modalStore.component"
    v-bind="modalStore.props"
    @click="closeModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
  >
    <component
      :is="modals[modalStore.component as keyof typeof modals]"
      v-if="modalStore.component"
      v-bind="modalStore.props"
      @click.stop
    />
  </div>
</template>
