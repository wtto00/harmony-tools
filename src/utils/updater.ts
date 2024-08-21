import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { confirm } from '@tauri-apps/plugin-dialog'

export async function checkUpgrade() {
  const update = await check()
  if (!update) return
  const confirmation = await confirm(`v${update.version} 发布了，是否立即下载更新？\n更新内容：\n${update.body}`, {
    title: '新版本可用了！🎉',
    kind: 'info',
  })
  if (!confirmation) return
  await update.downloadAndInstall()
  await relaunch()
}
