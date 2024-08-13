<script lang="ts" setup>
import { computed } from "vue";

type AlertType = "info" | "danger" | "success" | "warning" | "dark";

const props = defineProps<{
  type?: AlertType;
}>();

const colorClass = computed(() => {
  switch (props.type) {
    case "danger":
      return "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400";
    case "success":
      return "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400";
    case "warning":
      return "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300";
    case "dark":
      return "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300";
    case "info":
    default:
      return "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400";
  }
});
</script>

<template>
  <div class="p-4 mb-4 text-sm rounded-lg" :class="colorClass" role="alert">
    <slot />
  </div>
</template>
