<script setup lang="ts">
import { UserPen as Profile, UserLock, Bell, SquareUserRound, Shield } from "lucide-vue-next";
</script>
<template>
  <nav class="h-full p-2 group w-64 flex flex-col space-y-2 overflow-scroll">
    <router-link
      class="flex items-center gap-4 p-2 rounded transition-colors"
      to="/settings/profile"
    >
      <Profile :size="32" />
      Profile
    </router-link>
    <router-link
      class="flex items-center gap-4 p-2 rounded transition-colors"
      to="/settings/notifications"
    >
      <Bell :size="32" />
      Notifications
    </router-link>

    <router-link
      class="flex items-center gap-4 p-2 rounded transition-colors"
      to="/settings/account"
    >
      <SquareUserRound :size="32" />
      Account
    </router-link>

    <router-link
      class="flex items-center gap-4 p-2 rounded transition-colors"
      to="/settings/privacy"
    >
      <UserLock :size="32" />
      Privacy
    </router-link>

    <router-link
      class="flex items-center gap-4 p-2 rounded transition-colors"
      to="/settings/security"
    >
      <Shield :size="32" />
      Security
    </router-link>
  </nav>
</template>
