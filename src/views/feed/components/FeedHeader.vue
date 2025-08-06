<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
const customerStore = useCustomerStore();
</script>
<template>
  <div class="flex sm:max-w-xl p-2 gap-4 mx-auto">
    <!-- Columna 1: Foto -->
    <div class="">
      <ProfilePhoto class="rounded-full max-w-32 bg-gray-300" />
    </div>

    <!-- Columna 2: 3 filas -->
    <div class="flex flex-col justify-center gap-2">
      <div class="flex items-center gap-2">
        <b class="uppercase">{{ customerStore.customer.profile?.username }}</b>
        <button class="btn btn-sm btn-primary">Follow</button>
        <button class="btn btn-sm btn-primary">Send message</button>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-gray-500"
          >Posts:

          <b>0</b>
        </span>
        <span class="text-gray-500"
          >Followers:
          <b>0</b>
        </span>
        <span class="text-gray-500"
          >Follows:
          <b>0</b>
        </span>
      </div>
      <div class="flex items-center gap-4 text-xs text-gray-400">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum ullam saepe culpa nihil
          eos fugiat, placeat fugit velit reprehenderit, ea minima non consequuntur quia quidem
          pariatur odio facere, fuga quo?
        </p>
      </div>
    </div>
  </div>
</template>
