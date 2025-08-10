<!-- ModalManager.vue -->
<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import ConfirmModal from "@/components/modals/ConfirmMessageModal.vue";
import ConfirmPasswordModal from "@/components/modals/ConfirmPasswordModal.vue";
import PostCreate from "@/components/post/PostCreate.vue";
import PostItem from "@/components/post/PostItem.vue";
import FollowersList from "@/components/follow/FollowersList.vue";
import FollowedList from "@/components/follow/FollowedList.vue";
const modalStore = useModalStore();

const modals = {
  ConfirmModal,
  ConfirmPasswordModal,
  PostCreate,
  PostItem,
  FollowersList,
  FollowedList,
};
</script>

<template>
  <component
    :is="modals[modalStore.component as keyof typeof modals]"
    v-if="modalStore.component"
    v-bind="modalStore.props"
  />
</template>
