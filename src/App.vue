<script setup lang="ts">
import { ref } from "vue";
import { listTargets, type Target } from "./utils/hdc";
import Status from "./components/Status.vue";
import { initTheme } from "./state/theme";

const devices = ref<Target[]>([]);

async function init() {
  try {
    initTheme();
    devices.value = await listTargets();
  } catch (error) {
    console.log(error);
  }
}

void init();
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center bg-white dark:bg-gray-900">
    <div class="relative overflow-x-auto shadow-md">
      <div class="pb-4 px-4 pt-2 space-x-3 bg-white dark:bg-gray-900 flex justify-between items-center">
        <h5 class="mr-3 font-semibold dark:text-white">设备列表</h5>
        <button
          type="button"
          class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          @click="init"
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
            v-for="device in devices"
            :key="device.name"
            class="bg-white border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ device.name }}
            </th>
            <td class="px-6 py-4">{{ device.mode }}</td>
            <td class="px-6 py-4">
              <Status :online="device.status === 'Connected'" />
            </td>
            <td class="px-6 py-4">{{ device.host }}</td>
            <td class="px-6 py-4 text-right">
              <button
                v-if="device.status === 'Connected'"
                type="button"
                class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                安装HAP
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
