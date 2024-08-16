<template>
  <div class="relative">
    <slot />
    <div
      v-if="state.loading"
      class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 flex flex-col justify-center items-center"
    >
      <Loading />
      <div v-if="state.text" class="text-md mt-2 text-gray-500 dark:text-gray-400">{{ state.text }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Loading from "./Loading.vue";
import { state } from "../state/loading";
</script>
