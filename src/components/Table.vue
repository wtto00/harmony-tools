<script lang="ts" setup>
import type { Target } from "../utils/hdc";
import Choose from "./Choose.vue";
import Status from "./Status.vue";

defineProps<{
  data: Target[];
}>();
</script>

<template>
  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">名称</th>
        <th scope="col" class="px-6 py-3">连接方式</th>
        <th scope="col" class="px-6 py-3">状态</th>
        <th scope="col" class="px-6 py-3">主机</th>
        <th scope="col" class="px-6 py-3">
          <span class="sr-only">操作</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="device in data"
        :key="device.name"
        class="bg-white border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {{ device.name }}
        </th>
        <td class="px-6 py-4">{{ device.mode }}</td>
        <td class="px-6 py-4">
          <Status :status="device.status" />
        </td>
        <td class="px-6 py-4">{{ device.host }}</td>
        <td class="px-6 py-4 text-right">
          <Choose accept=".hap">
            <button
              v-if="device.status === 'Connected'"
              type="button"
              class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              安装HAP
            </button>
          </Choose>
        </td>
      </tr>
    </tbody>
  </table>
</template>
