<script setup lang="ts">
defineProps<{
  online?: boolean;
}>();
</script>

<template>
  <div class="flex items-center">
    <div class="h-2.5 w-2.5 rounded-full me-2" :class="[online ? 'bg-green-500' : 'bg-red-500']"></div>
    {{ online ? "Online" : "Offline" }}
  </div>
</template>
