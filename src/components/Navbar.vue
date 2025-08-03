<script setup lang="ts"></script>
<template>
  <nav>
    <ul class="flex space-x-4">
      <li>
        <router-link to="/" class="text-gray-600 hover:text-blue-500">Home</router-link>
      </li>
      <li>
        <router-link to="/about" class="text-gray-600 hover:text-blue-500">About</router-link>
      </li>
      <li>
        <router-link to="/contact" class="text-gray-600 hover:text-blue-500">Contact</router-link>
      </li>
    </ul>
  </nav>
</template>
