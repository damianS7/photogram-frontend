<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();
const profileImgURL = ref("");

onMounted(() => {
  if (customerStore.customer.profile?.avatarFilename) {
    reloadProfileImg();
  }
});

watch(
  () => customerStore.customer.profile?.avatarFilename,
  () => {
    reloadProfileImg();
  },
  { immediate: true }
);

// updates the photoUrl
function reloadProfileImg() {
  const profilePhotoURL = localStorage.getItem("profilePhotoURL");
  if (profilePhotoURL) {
    profileImgURL.value = profilePhotoURL;
  }
}
</script>
<template>
  <img v-if="profileImgURL" :src="profileImgURL" />
  <div v-else class="bg-gray-300"></div>
</template>
