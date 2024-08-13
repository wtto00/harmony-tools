<template>
  <div class="pb-4 px-4 pt-2 space-x-3 bg-white dark:bg-gray-900 flex justify-between items-center">
    <h5 class="mr-3 font-semibold dark:text-white">设备列表</h5>
    <button
      type="button"
      class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      @click="$emit('refresh')"
    >
      <svg
        class="h-3.5 w-3.5 mr-2 -ml-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
        />
      </svg>
      刷新
    </button>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{
  refresh: [];
}>();
</script>
