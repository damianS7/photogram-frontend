<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import UserPageHeader from "./components/UserPageHeader.vue";
import UserPosts from "./components/UserPosts.vue";
import { useRoute } from "vue-router";
defineProps<{
  username: string;
}>();
const customerStore = useCustomerStore();
const route = useRoute();

// if username is not provided in route params, use the current user's first name
if (!route.params.username) {
  route.params.username = customerStore.customer.profile?.firstName;
}
const username = route.params.username as string;
</script>
<template>
  <UserPageHeader :username="username" />
  <UserPosts :username="username" />
</template>
