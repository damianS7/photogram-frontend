<script setup lang="ts">
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { computed, onMounted, ref } from "vue";
import { authService } from "@/services/authService";
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref();

function redirectBackToLastPage() {
  const redirectPath = route.query.redirect?.toString() || "/home";
  router.push(redirectPath);
}

function requestAccountActivationEmail() {
  authService.requestAccountActivationEmail(email.value);
}

onMounted(() => {
  // Check if the user is already authenticated
  if (authStore.isAuthenticated) {
    redirectBackToLastPage();
  }
});
</script>
<template>
  <div>
    <div class="w-full text-center mb-8">
      <span class="logo" to="/"> Photogram </span>
    </div>
    <div class="bg-white p-2 rounded-lg shadow-md">
      <input class="w-full" v-model="email" type="text" />
    </div>
    <button @click="requestAccountActivationEmail" class="btn btn-lg btn-primary">
      Request token
    </button>
  </div>
</template>
<style scoped>
.logo {
  font-family: "Grand Hotel", cursive;
  font-size: 3.6rem;
}
</style>
