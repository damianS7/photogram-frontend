<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { Bell } from "lucide-vue-next";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
const customerStore = useCustomerStore();
</script>
<template>
  <header class="flex justify-end items-center gap-2 w-full p-2 shadow">
    <span class="">
      Welcome
      <b class="uppercase">{{ customerStore.customer.profile?.firstName }}</b>
    </span>

    <span>
      <ProfilePhoto class="rounded-full w-6 h-6 bg-gray-300" />
    </span>
    <Bell />
  </header>
</template>
