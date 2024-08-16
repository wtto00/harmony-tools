<script lang="ts" setup>
import { computed, ref } from "vue";
import { state } from "../state/alert";

const colorClass = computed(() => {
  switch (state.type) {
    case "danger":
      return "text-red-800 dark:text-red-400 bg-red-50 dark:bg-gray-800";
    case "success":
      return "text-green-800 dark:text-green-400 bg-green-50 dark:bg-gray-800";
    case "warning":
      return "text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-gray-800";
    case "dark":
      return "text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800";
    case "info":
    default:
      return "text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-gray-800";
  }
});

const closeColorClass = computed(() => {
  switch (state.type) {
    case "danger":
      return "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700";
    case "success":
      return "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700";
    case "warning":
      return "bg-yellow-50 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700";
    case "dark":
      return "bg-gray-50 text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white";
    case "info":
    default:
      return "bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700";
  }
});

const closed = ref(false);
function transitionend(e: TransitionEvent) {
  if (e.propertyName === "opacity" && getComputedStyle(e.target as HTMLDivElement).opacity === "0") {
    closed.value = true;
  }
}
function close() {
  state.message = "";
}
</script>

<template>
  <div
    class="items-center justify-between p-4 text-sm rounded-lg transition-transform-opacity duration-500"
    :class="[colorClass, state.message ? '' : 'opacity-0 -translate-y-1', closed && !state.message ? 'hidden' : 'flex']"
    role="alert"
    @transitionend="transitionend"
  >
    <svg
      class="flex-shrink-0 inline w-4 h-4 me-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        v-if="state.type === 'info'"
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z"
      />
      <path
        v-else-if="state.type === 'danger'"
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z"
      />
      <path
        v-else-if="state.type === 'success'"
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
      />
      <path
        v-else-if="state.type === 'warning'"
        d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"
      />
      <path
        v-else
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z"
      />
    </svg>
    <div class="font-medium">
      {{ state.message }}
    </div>
    <button
      type="button"
      class="ms-auto ml-4 -mr-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8"
      :class="closeColorClass"
      aria-label="Close"
      @click="close"
    >
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>
</template>
