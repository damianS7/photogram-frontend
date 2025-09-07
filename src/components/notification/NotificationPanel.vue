<script setup lang="ts">
import { useNotificationStore } from "@/stores/notification";
import { storeToRefs } from "pinia";
import { Heart, Users, MessageCircleCode } from "lucide-vue-next";
// const { isCurrentUserOwner } = authUtils();
// stores
const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);
</script>
<template>
  <div
    class="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-100 border border-gray-300 w-80 rounded-md shadow-md z-50 overflow-hidden"
  >
    <div class="overflow-x-hidden h-40 w-full rounded-md space-y-1 p-3">
      <slot v-for="notification in notifications">
        <p class="w-full text-sm truncate bg-gray-200 hover:bg-gray-300 p-1 rounded">
          <slot v-if="notification.type === 'LIKE'">
            <span class="flex items-center gap-1">
              <Heart :size="18" class="text-red-500" style="fill: currentColor" />
              <router-link :to="'/@' + notification.metadata.username">
                <span class="font-bold">
                  {{ notification.metadata.username }}
                </span>
              </router-link>
              <span> has liked your </span>
              <router-link :to="'/posts/' + notification.metadata.postId">
                <span class="font-bold">post.</span>
              </router-link>
            </span>
          </slot>

          <slot v-if="notification.type === 'FOLLOW'">
            <span class="flex items-center gap-1">
              <Users :size="18" class="text-blue-500" style="fill: currentColor" />
              <router-link :to="'/@' + notification.metadata.username">
                <span class="font-bold">
                  {{ notification.metadata.username }}
                </span>
              </router-link>
              <span> has follow you. </span>
            </span>
          </slot>

          <slot v-if="notification.type === 'COMMENT'">
            <span class="flex items-center gap-1">
              <MessageCircleCode :size="18" class="text-blue-300" style="fill: currentColor" />
              <router-link :to="'/@' + notification.metadata.username">
                <span class="font-bold">
                  {{ notification.metadata.username }}
                </span>
              </router-link>
              <span> has comment your </span>
              <router-link :to="'/posts/' + notification.metadata.postId">
                <span class="font-bold">post.</span>
              </router-link>
            </span>
          </slot>
          <!-- <span>{{ notification.createdAt }}</span> -->
        </p>
      </slot>
    </div>
    <span class="flex justify-end p-1">
      <button class="btn btn-xs btn-secondary" @click="notificationStore.clearNotifications()">
        Clear
      </button>
    </span>
  </div>
</template>
