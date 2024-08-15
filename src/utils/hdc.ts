import { invoke } from "@tauri-apps/api/core";
import { Command } from "@tauri-apps/plugin-shell";

export async function hdc(...args: string[]) {
  const command = Command.sidecar("binaries/hdc", args);
  const output = await command.execute();
  console.log(`hdc ${args.join(" ")}`, output);

  if (output.code) {
    return Promise.reject(output.stderr);
  }
  return Promise.resolve(output.stdout);
}

export type TargetMode = "TCP" | "USB";
export type TargetStatus = "Connected" | "Offline";
export interface Target {
  name: string;
  mode: TargetMode;
  status: TargetStatus;
  host: string;
}

/**
 * 列举连接的鸿蒙设备
 */
export async function listTargets() {
  const output = await hdc("list", "targets", "-v");
  const lines = output
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item);
  const targets: Target[] = [];
  lines.forEach((line) => {
    const [name, mode, status, host] = line.split(/\t+/);
    if (status) {
      targets.push({ name, mode: mode as TargetMode, status: status as TargetStatus, host });
    }
  });
  return targets;
}

/**
 * 停止关闭已连接设备的选定App
 * @param applicationId App包名
 * @param deviceId 已连接的设备ID，默认为已连接的第一个设备
 */
export async function stopApp(applicationId: string, deviceId?: string) {
  const deviceArgs = deviceId ? ["-t", deviceId] : [];
  return hdc(...deviceArgs, "shell", "aa", "force-stop", applicationId);
}

/**
 * 为已连接的设备安装App
 * @param hapPath hap安装包文件位置
 * @param deviceId 已连接设备ID，默认为已连接的第一个设备
 */
export async function installApp(hapPath: string, deviceId?: string) {
  // hdc shell mkdir data/local/tmp/d701df1f98934003af5f6d033da89315
  // hdc file send /Users/wtto/projects/huayi/huayimt-app/harmony/entry/build/default/outputs/default/entry-default-signed.hap "data/local/tmp/d701df1f98934003af5f6d033da89315"
  // hdc shell bm install -p data/local/tmp/d701df1f98934003af5f6d033da89315
  // hdc shell rm -rf data/local/tmp/d701df1f98934003af5f6d033da89315
  if (!hapPath) return Promise.reject("Hap file path cannot be empty.");

  const deviceArgs = deviceId ? ["-t", deviceId] : [];

  const md5 = await invoke("file_md5", { path: hapPath });
  const tmpPath = `data/local/tmp/${md5}`;
  // hdc -t 127.0.0.1:5555 shell mkdir data/local/tmp/66d188b784931ffe864b9475969e96a2
  // hdc -t 127.0.0.1:5555 file send /Users/wtto/projects/huayi/huayimt-app/harmony/entry/build/default/outputs/default/entry-default-signed.hap "data/local/tmp/66d188b784931ffe864b9475969e96a2"
  // hdc -t 127.0.0.1:5555 shell bm install -p data/local/tmp/66d188b784931ffe864b9475969e96a2
  // hdc -t 127.0.0.1:5555 shell rm -rf data/local/tmp/66d188b784931ffe864b9475969e96a2
  try {
    const res1 = await hdc(...deviceArgs, "shell", "mkdir", tmpPath);
    console.log("res1", res1);
    const res2 = await hdc(...deviceArgs, "file", "send", hapPath, `"${tmpPath}"`);
    console.log("res2", res2);
    const res3 = await hdc(...deviceArgs, "shell", "bm", "install", "-p", tmpPath);
    console.log("res3", res3);
    const res4 = await hdc(...deviceArgs, "shell", "rm", "-rf", tmpPath);
    console.log("res4", res4);
  } catch (error) {
    console.log("error", error);
    const res5 = await hdc(...deviceArgs, "shell", "rm", "-rf", tmpPath);
    console.log("res5", res5);
  }
}
