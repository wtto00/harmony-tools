<script setup lang="ts">
import { provide, reactive, ref } from "vue";
import { listTargets, type Target } from "./utils/hdc";
import { initTheme } from "./state/theme";
import TableHeader from "./components/TableHeader.vue";
import Table from "./components/Table.vue";
import Spinner from "./components/Spinner.vue";
import Header from "./components/Header.vue";
import type { AlertType } from "./components/Alert.vue";
import Alert from "./components/Alert.vue";
import { ALERT_KEY } from "./utils/symbol";

const loading = ref(false);
const devices = ref<Target[]>([{ name: "TEST", mode: "USB", status: "Connected", host: "localhost" }]);

async function getDevicesList(successAlert?: boolean) {
  try {
    loading.value = true;
    devices.value = await listTargets();
    if (successAlert) {
      alertMsg("success", "已刷新");
    }
  } catch (error) {
    alertMsg("danger", (error as Error).message || "出错了");
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

const alertState = reactive({
  type: "info" as AlertType,
  message: "",
});
let alertClock: ReturnType<typeof setTimeout>;
/**
 * @param type 类型
 * @param msg 消息内容
 * @param notAutoClose type为danger时默认不自动关闭，否则默认自动关闭
 */
function alertMsg(type: AlertType, msg: string, notAutoClose?: boolean) {
  clearTimeout(alertClock);
  Object.assign(alertState, {
    type,
    message: msg,
  });
  if ((type === "danger" && notAutoClose === false) || (type !== "danger" && notAutoClose !== true)) {
    alertClock = setTimeout(() => {
      alertState.message = "";
    }, 2000);
  }
}
provide(ALERT_KEY, alertMsg);
</script>

<template>
  <Header />
  <Alert
    class="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-xl"
    :type="alertState.type"
    v-model:message="alertState.message"
  />
  <div class="w-screen h-screen flex pt-12 justify-center items-center bg-white dark:bg-gray-900">
    <Spinner class="shadow-md" :loading="loading">
      <TableHeader @refresh="getDevicesList(true)" />
      <Table :data="devices" />
    </Spinner>
  </div>
</template>
