<script setup lang="ts">
import { ref } from 'vue'
import { installApp, listTargets, type Target } from './utils/hdc'
import { initTheme } from './state/theme'
import TableHeader from './components/TableHeader.vue'
import Table from './components/Table.vue'
import Spinner from './components/Spinner.vue'
import Header from './components/Header.vue'
import Alert from './components/Alert.vue'
import { alertMsg } from './state/alert'
import { state as loadingState, showLoading, hideLoading } from './state/loading'
import { listen } from '@tauri-apps/api/event'

const devices = ref<Target[]>([])

/**
 * 获取连接设备列表
 * @param isRefresh 标记是点击刷新的操作，还是刚进入页面初始化的操作
 */
async function getDevicesList(isRefresh?: boolean) {
  try {
    showLoading()
    devices.value = await listTargets()
    if (devices.value.length === 0) {
      alertMsg('warning', '没有已连接的设备或模拟器', true)
    } else if (isRefresh) {
      alertMsg('success', '已刷新')
    }
  } catch (error) {
    alertMsg('danger', (error as Error).message || '出错了')
  }
  hideLoading()
}
void getDevicesList()

// 亮色/暗色主题初始化
initTheme()

// 屏蔽右键菜单
if (import.meta.env.PROD) {
  document.body.addEventListener('contextmenu', (e) => {
    e.stopPropagation()
    e.preventDefault()
  })
}

// 拖拽文件到窗口
interface DragDropEventPayload {
  paths: string[]
  position: { x: number; y: number }
}
listen<DragDropEventPayload>('tauri://drag-drop', async (event) => {
  if (devices.value.filter((device) => device.status === 'Connected').length === 0) {
    alertMsg('warning', '没有可用的已连接设备')
    return
  }
  if (loadingState.loading) {
    alertMsg('warning', '正在处理中，请稍后再试')
    return
  }
  const files = event.payload.paths.filter((file) => file.toLocaleLowerCase().endsWith('.hap'))
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filename = file.substring(file.lastIndexOf('/') + 1)
    showLoading(`正在安装${filename}`)
    try {
      await installApp(file)
      alertMsg('success', `安装${filename}成功`)
    } catch (error) {
      alertMsg('danger', `安装${filename}出错了: ${(error as Error).message || '未知错误'}`)
    }
  }
  hideLoading()
})
</script>

<template>
  <Header />
  <Alert class="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-xl" />
  <div class="w-screen h-screen flex pt-12 justify-center items-center bg-white dark:bg-gray-900">
    <Spinner class="shadow-md">
      <TableHeader @refresh="getDevicesList(true)" :class="[loadingState.loading ? 'opacity-20' : '']" />
      <Table :data="devices" :class="[loadingState.loading ? 'opacity-20' : '']" />
    </Spinner>
  </div>
</template>
