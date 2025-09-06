<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { Settings, LogOut } from "lucide-vue-next";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
import { useAuthStore } from "@/stores/auth";
import NotificationButton from "./NotificationButton.vue";

// store
const customerStore = useCustomerStore();
const authStore = useAuthStore();

// functions
function logout() {
  authStore.logout();
}
</script>
<template>
  <header class="w-full shadow p-2">
    <div class="flex justify-between sm:max-w-2xl w-full gap-2 mx-auto">
      <div>
        <router-link class="logo" to="/"> Photogram </router-link>
      </div>

      <div class="flex items-center gap-2">
        <span class="">
          Welcome
          <b class="uppercase">
            <router-link :to="`/@${customerStore.customer.profile.username}`">
              {{ customerStore.customer.profile?.firstName }}
            </router-link>
          </b>
        </span>

        <span>
          <router-link :to="`/settings/profile`">
            <ProfilePhoto class="rounded-full w-6 h-6 bg-gray-300" />
          </router-link>
        </span>
        <span>
          <NotificationButton />
        </span>
        <router-link to="/settings">
          <Settings :size="26" />
        </router-link>
        <router-link to="/auth/login" @click.prevent="logout">
          <LogOut :size="26" />
        </router-link>
      </div>
    </div>
  </header>
</template>
<style scoped>
.logo {
  font-family: "Grand Hotel", cursive;
  font-size: 1.6rem;
}
</style>
