<template>
  <div class="relative">
    <slot :class="loading ? 'opacity-20' : ''" />
    <Loading v-if="loading" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2" />
  </div>
</template>

<script lang="ts" setup>
import Loading from "./Loading.vue";

defineProps<{
  loading?: boolean;
}>();
</script>
