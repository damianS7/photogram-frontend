<!-- ModalManager.vue -->
<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import ConfirmModal from "@/components/modals/ConfirmMessageModal.vue";
import ConfirmPasswordModal from "@/components/modals/ConfirmPasswordModal.vue";
import FeedPostCreate from "@/views/feed/components/FeedPostCreate.vue";
import FeedPostItem from "@/views/feed/components/FeedPostItem.vue";
const modalStore = useModalStore();

const modals = {
  ConfirmModal,
  ConfirmPasswordModal,
  FeedPostCreate,
  FeedPostItem,
};
</script>

<template>
  <component
    :is="modals[modalStore.component as keyof typeof modals]"
    v-if="modalStore.component"
    v-bind="modalStore.props"
  />
</template>
