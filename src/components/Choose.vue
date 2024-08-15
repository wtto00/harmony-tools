<script lang="ts" setup>
defineProps<{
  accept: string;
}>();

function changeFile(e: Event) {
  console.log(e);
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
}

function triggerChoose(e: MouseEvent) {
  const target = e.currentTarget as HTMLDivElement;
  const input = target.firstElementChild as HTMLInputElement;
  console.log(input);
  input.click();
}
</script>

<template>
  <div class="relative" @click="triggerChoose">
    <input
      class="absolute overflow-hidden -z-1 w-1 h-1 opacity-0"
      type="file"
      @change="changeFile"
      :accept
      placeholder="choose file"
    />
    <slot />
  </div>
</template>
