<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2 py-8">
    <div class="w-full text-center mb-8">
      <span class="logo" to="/"> Photogram </span>
    </div>
    <div class="w-full max-w-md">
      <router-view></router-view>
    </div>
    <div class="mt-6 text-center text-sm text-gray-600 space-y-1">
      <RouterLink
        v-if="!route.path.includes('/auth/login')"
        to="/auth/login"
        class="block hover:underline text-blue-600"
      >
        Sign in
      </RouterLink>
      <RouterLink
        v-if="!route.path.includes('/auth/register')"
        to="/auth/register"
        class="block hover:underline text-blue-600"
      >
        ¿Dont you have an account? Sign up
      </RouterLink>
      <RouterLink
        v-if="!route.path.includes('/accounts/reset-password')"
        to="/accounts/reset-password"
        class="block hover:underline text-blue-600"
      >
        ¿Forgot your password?
      </RouterLink>
      <RouterLink
        v-if="!route.path.includes('/accounts/activate')"
        to="/accounts/activate"
        class="block hover:underline text-blue-600"
      >
        Activate account
      </RouterLink>
    </div>
  </div>
</template>
<style scoped>
.logo {
  font-family: "Grand Hotel", cursive;
  font-size: 3.6rem;
}
</style>
