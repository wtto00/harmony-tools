<script setup lang="ts">
import { TargetStatus } from '../utils/hdc'

defineProps<{
  status: TargetStatus
}>()
</script>

<template>
  <div class="flex items-center">
    <div class="h-2.5 w-2.5 rounded-full me-2" :class="[status === 'Connected' ? 'bg-green-500' : 'bg-red-500']"></div>
    {{ status }}
  </div>
</template>
