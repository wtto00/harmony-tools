import { Command } from '@tauri-apps/plugin-shell'

export async function hdc(...args: string[]) {
  const command = Command.sidecar('binaries/hdc', args)
  const output = await command.execute()
  // console.log(`hdc ${args.join(" ")}`, output);
  if (output.code || output.stderr) {
    return Promise.reject(Error(output.stderr))
  }
  return Promise.resolve(output.stdout)
}

export type TargetMode = 'TCP' | 'USB'
export type TargetStatus = 'Connected' | 'Offline'
export interface Target {
  name: string
  mode: TargetMode
  status: TargetStatus
  host: string
}

/**
 * 列举连接的鸿蒙设备
 */
export async function listTargets() {
  const output = await hdc('list', 'targets', '-v')
  const lines = output
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item)
  const targets: Target[] = []
  lines.forEach((line) => {
    const [name, mode, status, host] = line.split(/\t+/)
    if (status === 'Connected' || status === 'Offline') {
      targets.push({ name, mode: mode as TargetMode, status: status as TargetStatus, host })
    }
  })
  return targets
}

/**
 * 停止关闭已连接设备的选定App
 * @param applicationId App包名
 * @param deviceId 已连接的设备ID，默认为已连接的第一个设备
 */
export async function stopApp(applicationId: string, deviceId?: string) {
  const deviceArgs = deviceId ? ['-t', deviceId] : []
  return hdc(...deviceArgs, 'shell', 'aa', 'force-stop', applicationId)
}

/**
 * 为已连接的设备安装App
 * @param hapPath hap安装包文件位置
 * @param deviceId 已连接设备ID，默认为已连接的第一个设备
 */
export async function installApp(hapPath: string, deviceId?: string) {
  if (!hapPath) return Promise.reject(Error('Hap file path cannot be empty.'))

  const deviceArgs = deviceId ? ['-t', deviceId] : []

  const output = await hdc(...deviceArgs, 'install', '-r', hapPath)

  const line = output.split('\n')[0]
  const index = line.indexOf('msg:')
  const result = line.substring(index + 4).trim()

  if (result === 'install bundle successfully.') {
    return Promise.resolve(result)
  }
  switch (result) {
    case 'install bundle successfully.':
      return Promise.resolve(result)
    case 'error: failed to install bundle. code:9568332 error: install sign info inconsistent.':
      return Promise.reject(Error('选择的hap文件未签名!'))
    default:
      return Promise.reject(Error(result))
  }
}
