<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/spinner/FullScreenLoadingSpinner.vue";
import ModalManager from "@/components/modals/ModalManager.vue";
</script>
<template>
  <div>
    <FullScreenLoadingSpinner />
    <ModalManager />
    <router-view />
    <!-- <toast-manager /> -->
  </div>
</template>
<style>
* {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    sans-serif;
}

header,
nav,
.main-container,
.container {
  @apply bg-gray-200;
}

.container {
  @apply p-2;
}

nav {
  @apply border-r-2 border-solid border-gray-300;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav a:hover {
  @apply text-blue-500;
}

nav a.router-link-exact-active {
  @apply rounded;
  @apply font-bold;
  @apply text-blue-500;
  @apply bg-gray-300;
}

.btn {
  @apply font-bold rounded;
}

.btn-lg {
  @apply font-bold p-2 rounded text-sm;
}

.btn-sm {
  @apply font-bold p-1 px-2 rounded text-sm;
}

.btn-xs {
  @apply font-bold text-xs p-0.5 rounded;
}

.btn-primary,
.btn-blue,
.btn-info {
  @apply bg-blue-500 text-white;
}
.btn-primary:hover,
.btn-blue:hover,
.btn-info:hover {
  @apply bg-blue-600;
}

.btn-secondary {
  @apply bg-gray-400 text-white;
}

.btn-success {
  @apply bg-green-600 text-white;
}

.btn-success:hover {
  @apply bg-green-700 text-white;
}

.btn-danger {
  @apply bg-red-300 text-red-600;
}

.btn-danger:hover {
  @apply bg-red-500 text-white;
}

.pill {
  @apply font-bold text-sm px-2 py-1 rounded-full;
}

.pill-xs {
  @apply font-bold text-xs px-1.5 py-0.5 rounded-full;
}

.pill-primary,
.pill-blue {
  @apply bg-blue-200 text-blue-500;
}
</style>
