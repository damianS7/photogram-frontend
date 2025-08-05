<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { ref } from "vue";
const customerStore = useCustomerStore();
const posts = ref([
  { id: 1, title: "First Post", content: "/uploads/ggg.jpg" },
  { id: 2, title: "Second Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 3, title: "Third Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 4, title: "Fourth Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 5, title: "Fifth Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 6, title: "Sixth Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 7, title: "Seventh Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 8, title: "Eighth Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 9, title: "Ninth Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
  { id: 10, title: "Tenth Post", content: "/Users/damian/Pictures/dev/ggg.jpg" },
]);
</script>
<template>
  <!-- Contenedor que agrupa todas las tarjetas -->

  <div class="mt-8 grid grid-cols-3 gap-0.5 mx-auto sm:max-w-2xl">
    <div class="flex w-full h-72" v-for="post in posts" :key="post.id">
      <img :src="post.content" alt="Post Image" class="object-cover w-full h-full" />
    </div>
  </div>
</template>
