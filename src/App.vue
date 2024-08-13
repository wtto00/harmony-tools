<script setup lang="ts">
import { ref } from "vue";
import { listTargets, type Target } from "./utils/hdc";
import { initTheme } from "./state/theme";
import TableHeader from "./components/TableHeader.vue";
import Table from "./components/Table.vue";
import Spinner from "./components/Spinner.vue";
import Header from "./components/Header.vue";

const loading = ref(false);
const devices = ref<Target[]>([]);

async function getDevicesList() {
  try {
    loading.value = true;
    devices.value = await listTargets();
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
void getDevicesList();

initTheme();

if (import.meta.env.PROD) {
  document.body.addEventListener("contextmenu", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });
}
</script>

<template>
  <Header />
  <div class="w-screen h-screen flex pt-12 justify-center items-center bg-white dark:bg-gray-900">
    <Spinner class="shadow-md" :loading="loading">
      <TableHeader @refresh="getDevicesList" />
      <Table :data="devices" />
    </Spinner>
  </div>
</template>
